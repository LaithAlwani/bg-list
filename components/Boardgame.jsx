import Image from "next/image";
import { PiUsersThreeFill, PiTimerFill, PiLinkBold  } from "react-icons/pi";

export default function Boardgame({ boardgame }) {
  const { id, thumbnail, image, title, minPlayers, maxPlayers, playTime, bggLink } = boardgame;
  return (
    <div className="boardgame" id={id}>
      <Image src={thumbnail} fill sizes="(max-width: 768px) 25vw" alt={title} />
      <div className="content-wrapper">
        <div className="content">
          <h4 className="title">{title}</h4>
          <p>
            <PiUsersThreeFill size={24} /> {minPlayers} - {maxPlayers}
          </p>
          <p>
            <PiTimerFill /> {playTime}
          </p>
          <a href={bggLink} >
            <PiLinkBold  /> BGG
          </a>
        </div>
      </div>
    </div>
  );
}
