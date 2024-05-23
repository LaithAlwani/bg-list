"use client";

import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { toast } from "react-hot-toast";
import Boardgame from "@/components/Boardgame";

export default function Home() {
  const [boardgames, setBoardgames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return toast.error("Please enter username");
    setLoading(true);
    try {
      const res = await fetch(`https://boardgamegeek.com/xmlapi2/collection?username=${username}`);
      const data = await res.text();
      const parser = new XMLParser({ ignoreAttributes: false });
      const { items } = parser.parse(data);

      if (items?.item) {
        setBoardgames([]);
        console.log(items.item[0]);
        items.item.forEach(async (item) => {
          const id = item["@_objectid"];
          const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
          const data = await res.text();
          const parser = new XMLParser({ ignoreAttributes: false });
          const { items } = parser.parse(data);

          if (items.item) {
            setBoardgames((prevState) => [
              ...prevState,
              {
                title: item.name["#text"],
                thumbnail: items.item.thumbnail,
                image: items.item.image,
                isExpansion: items.item["@_type"] === "boardgameexpansion",
                year: items.item.yearpublished["@vaule"],
                status: {
                  own: item.status["@_own"],
                  forTrade: item.status["@_fortrade"],
                  preorder: item.status["@_preordered"],
                  preowned: item.status["@_prevowned"],
                  want: item.status["@_want"],
                  wantToBuy: item.status["@_wanttobuy"],
                  wantToPlay: item.status["@_wanttoplay"],
                  wishlist: item.status["@_wishlist"],
                  wishlistProprity: item.status["@_wishlistpriority"],
                },
                minPlayers: items.item.minplayers["@_value"],
                maxPlayers: items.item.maxplayers["@_value"],
                playTime: items.item.playingtime["@_value"],
                bggLink: `https://boardgamegeek.com/boardgame/${id}`,
                id: id,
              },
            ]);
          }
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
    
  }

  useEffect(() => {}, []);
  return (
    <main>
      <h1>Boardgame List</h1>
      {!boardgames.length && <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="BGG username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button>Get Games</button>
      </form>}
      {boardgames.length && <button onClick={pickRandomGame}>Random game</button>}
      {!loading ? (
        boardgames.length > 0 && (
          <>
            <h2>Owned:</h2>
            <div className="boardgames-container">
              {boardgames
                .filter((bg) => bg.status.own === "1")
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
