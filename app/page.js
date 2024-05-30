"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Boardgame from "@/components/Boardgame";
import { createBoardgame, fetchBoardGameBGG, fetchUserListBGG } from "@/lib/functions";
import BoardgameList from "@/components/BoardgameList";

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
          const boardgameItem = await fetchBoardGameBGG(id);

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
            <BoardgameList boardgames={boardgames} title="Owned" exp={true} type="own" />
            <BoardgameList boardgames={boardgames} title="For Trade" exp={true} type="forTrade" />
            <BoardgameList
              boardgames={boardgames}
              title="Want To Play"
              exp={true}
              type="watToPlay"
            />
            <BoardgameList boardgames={boardgames} title="Preorder" exp={true} type="preorder" />
            <BoardgameList boardgames={boardgames} title="Preowned" exp={true} type="preowned" />
            <BoardgameList
              boardgames={boardgames}
              title="Want To Buy"
              exp={true}
              type="wantToBuy"
            />
            <BoardgameList boardgames={boardgames} title="Wishlist" exp={true} type="wishlist" />
          </>
        )
      ) : (
        <h1>Loading....</h1>
      )}
    </main>
  );
}
