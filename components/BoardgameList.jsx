import React from "react";
import Boardgame from "./Boardgame";

export default function BoardgameList({ boardgames, title, exp, type }) {
  return (
    boardgames.filter((bg) => bg.status[type] === "1").length > 0 && (
      <>
        <h2>{title}:</h2>
        <div className="boardgames-container">
          {boardgames
            .filter((bg) => bg.status[type] === "1")
            .filter((bg) => (!exp ? bg.isExpansion === false : bg))
            .sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0))
            .map((bg) => (
              <Boardgame boardgame={bg} key={bg.id} />
            ))}
        </div>
      </>
    )
  );
}
