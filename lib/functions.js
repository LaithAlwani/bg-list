import { XMLParser } from "fast-xml-parser";
import toast from "react-hot-toast";

export const fetchUserListBGG = async (username) => {
  const res = await fetch(`https://boardgamegeek.com/xmlapi2/collection?username=${username}`);
  const data = await res.text();
  return parseData(data);
};
export const fetchBoardGameBGG = async (id) => {
  try {
    
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
    const data = await res.text();
    return parseData(data);
  }
  catch (err) {
    toast.error(err.message);
  }
};

export const createBoardgame = (listItem, boardgameItem) => {
  return {
    title: listItem.name["#text"],
    thumbnail: boardgameItem.thumbnail,
    image: boardgameItem.image,
    isExpansion: boardgameItem["@_type"] === "boardgameexpansion",
    year: boardgameItem.yearpublished["@vaule"],
    status: {
      own: listItem.status["@_own"],
      forTrade: listItem.status["@_fortrade"],
      preorder: listItem.status["@_preordered"],
      preowned: listItem.status["@_prevowned"],
      want: listItem.status["@_want"],
      wantToBuy: listItem.status["@_wanttobuy"],
      wantToPlay: listItem.status["@_wanttoplay"],
      wishlist: listItem.status["@_wishlist"],
      wishlistProprity: listItem.status["@_wishlistpriority"],
    },
    minPlayers: boardgameItem.minplayers["@_value"],
    maxPlayers: boardgameItem.maxplayers["@_value"],
    playTime: boardgameItem.playingtime["@_value"],
    bggLink: `https://boardgamegeek.com/boardgame/${listItem["@_objectid"]}`,
    id: listItem["@_objectid"],
  }
}

const parseData = (data) => {
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(data).items?.item;
}
