import {
  addEventHandlers,
  fillBoard,
  loadTiles,
  shuffleTiles
} from "./gamelogic.js";
import {addImageCopy, addImageDownload, getSVG} from "./ui.js";

const tiles = shuffleTiles(await loadTiles());
fillBoard(tiles);
const svg = await getSVG();
addEventHandlers(svg);
addImageDownload('download', 'outerCard');
addImageCopy('copy', 'outerCard');


