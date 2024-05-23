import Image from "next/image";
import { PiUsersThreeFill, PiTimerFill } from "react-icons/pi";

export default function Boardgame({ boardgame }) {
  const { thumbnail, image,title, minPlayers, maxPlayers, playTime} = boardgame
  return (
    <div className="boardgame" >
      <div className="img-wrapper">
        <Image src={thumbnail} fill sizes="(max-width: 768px) 100vw" alt={title} />
      </div>
      <h1>{title}</h1>
      <p>
        <PiUsersThreeFill size={24} /> {minPlayers} - {maxPlayers}
      </p>
      <p>
        <PiTimerFill /> {playTime}
      </p>
    </div>
  );
}
