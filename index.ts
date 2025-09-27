import {
  newGame,
  checkTimestamp,
} from "./src/gamelogic";
import {
  addGenerateNewCard,
  addImageCopy,
  addImageDownload,
} from "./src/ui";
import {init} from "./src/effects";

const oxideBingoTiles: string | null = localStorage.getItem("oxideBingoTiles");
const oxideBingoTime: string | null = localStorage.getItem("oxideBingoTime");

init();

if (oxideBingoTime && oxideBingoTiles) {
  checkTimestamp(oxideBingoTime);
} else {
  newGame();
}


addImageDownload("download", "outerCard");
addImageCopy("copy", "outerCard");
addGenerateNewCard("generateNewCard");
