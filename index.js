import {
  addEventHandlers,
  fillBoard,
  loadTiles,
  shuffleTiles
} from "./resources/gamelogic.js";
import {addImageCopy, addImageDownload, getSVG} from "./resources/ui.js";

const tiles = shuffleTiles(await loadTiles());
fillBoard(tiles);
const svg = await getSVG();
addEventHandlers(svg);
addImageDownload('download', 'outerCard');
addImageCopy('copy', 'outerCard');


