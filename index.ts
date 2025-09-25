import {
  addEventHandlers,
  newGame,
  checkTimestamp,
} from "./resources/gamelogic.js";
import {
  addGenerateNewCard,
  addImageCopy,
  addImageDownload,
  getSVG,
} from "./resources/ui.js";

const oxideBingoTiles = localStorage.getItem("oxideBingoTiles");
const oxideBingoTime = localStorage.getItem("oxideBingoTime");

if (oxideBingoTime && oxideBingoTiles) {
  checkTimestamp(oxideBingoTime);
} else {
  newGame();
}

const svg : string = await getSVG();
addEventHandlers(svg);
addImageDownload("download", "outerCard");
addImageCopy("copy", "outerCard");
addGenerateNewCard("generateNewCard");
