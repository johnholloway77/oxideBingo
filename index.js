import {
  addEventHandlers,
  fillBoard,
  loadTiles,
  shuffleTiles
} from "./gamelogic.js";
import {getSVG} from "./ui.js";

const tiles = shuffleTiles(await loadTiles());
fillBoard(tiles);
const svg = await getSVG();
addEventHandlers(svg);


