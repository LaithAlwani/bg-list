"use client";

import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { toast } from "react-hot-toast";
import Boardgame from "@/components/Boardgame";
import { createBoardgame, fetchBoardGameBGG, fetchUserListBGG } from "@/lib/functions";

export default function Home() {
  const [boardgames, setBoardgames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocalStorage, setLoadingLocalStorage] = useState(true);
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return toast.error("Please enter username");
    localStorage.setItem("username", username);

    setLoading(true);
    try {
      const userList = await fetchUserListBGG(username);

      if (userList) {
        setBoardgames([]);
        const bgArr = [];
        userList.forEach(async (listItem) => {
          const id = listItem["@_objectid"];
          const boardgameItem = await fetchBoardGameBGG(id)

          if (boardgameItem) {
            const TempBoardgame = createBoardgame(listItem, boardgameItem);
            setBoardgames((prevState) => [...prevState, TempBoardgame]);
           await bgArr.push(TempBoardgame);
          }
          localStorage.setItem("boardgames", JSON.stringify(bgArr));
        });
        
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pickRandomGame = () => {
    const ownedBoardgames = boardgames
      .filter((bg) => bg.status.own === "1")
      .filter((bg) => bg.isExpansion === false);
    const random = Math.floor(Math.random() * ownedBoardgames.length);
    document.getElementById(ownedBoardgames[random].id).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (localStorage.getItem("boardgames")) {
      setBoardgames(JSON.parse(localStorage.getItem("boardgames")));
    }
    if (localStorage.getItem("username")) {
      setUsername(localStorage.getItem("username"));
    }
    setLoadingLocalStorage(false);
  }, []);
  return (
    <main>
      <h1>Boardgame List</h1>
      {console.log(loading)}
      {loadingLocalStorage ? (
        <h1>Loading...</h1>
      ) : (
        !boardgames.length && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="BGG username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button>Get Games</button>
          </form>
        )
      )}
      {boardgames.length > 0 && <button onClick={pickRandomGame}>Random game</button>}
      {boardgames.length > 0 && <button onClick={handleSubmit}>Sync BGG Library</button>}
      {!loading ? (
        boardgames.length > 0 && (
          <>
            <h2>Owned:</h2>
            <div className="boardgames-container">
              {boardgames
                .filter((bg) => bg.status.own === "1")
                .filter((bg) => bg.isExpansion === false)
                .map((bg) => (
                  <Boardgame boardgame={bg} key={bg.id} />
                ))}
            </div>
            <h2>ForTrade:</h2>
            <div className="boardgames-container">
              {boardgames
                .filter((bg) => bg.status.forTrade === "1")
                .map((bg) => (
                  <Boardgame boardgame={bg} key={bg.id} />
                ))}
            </div>
            {boardgames.filter((bg) => bg.status.wantToPlay === "1").length > 0 && (
              <>
                <h2>Want to Play:</h2>
                <div className="boardgames-container">
                  {boardgames
                    .filter((bg) => bg.status.wantToPlay === "1")
                    .map((bg) => (
                      <Boardgame boardgame={bg} key={bg.id} />
                    ))}
                </div>
              </>
            )}
            {boardgames.filter((bg) => bg.status.preorder === "1").length > 0 && (
              <>
                <h2>Preorders:</h2>
                <div className="boardgames-container">
                  {boardgames
                    .filter((bg) => bg.status.preorder === "1")
                    .map((bg) => (
                      <Boardgame boardgame={bg} key={bg.id} />
                    ))}
                </div>
              </>
            )}
            <h2>Preowned:</h2>
            <div className="boardgames-container">
              {boardgames
                .filter((bg) => bg.status.preowned === "1")
                .map((bg) => (
                  <Boardgame boardgame={bg} key={bg.id} />
                ))}
            </div>
            {boardgames.filter((bg) => bg.status.wantToBuy === "1").length > 0 && (
              <>
                <h2>Want to Buy:</h2>
                <div className="boardgames-container">
                  {boardgames
                    .filter((bg) => bg.status.wantToBuy === "1")
                    .map((bg) => (
                      <Boardgame boardgame={bg} key={bg.id} />
                    ))}
                </div>
              </>
            )}
            {boardgames.filter((bg) => bg.status.wishlist != "0").length > 0 && (
              <>
                <h2>Wishlist:</h2>
                <div className="boardgames-container">
                  {boardgames
                    .filter((bg) => bg.status.wishlist != "0")
                    .map((bg) => (
                      <Boardgame boardgame={bg} key={bg.id} />
                    ))}
                </div>
              </>
            )}
          </>
        )
      ) : (
        <h1>Loading....</h1>
      )}
    </main>
  );
}
