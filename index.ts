import {
  newGame,
  checkTimestamp,
} from "./resources/gamelogic";
import {
  addGenerateNewCard,
  addImageCopy,
  addImageDownload,
} from "./resources/ui";

const oxideBingoTiles: string | null = localStorage.getItem("oxideBingoTiles");
const oxideBingoTime: string | null = localStorage.getItem("oxideBingoTime");

if (oxideBingoTime && oxideBingoTiles) {
  checkTimestamp(oxideBingoTime);
} else {
  newGame();
}


addImageDownload("download", "outerCard");
addImageCopy("copy", "outerCard");
addGenerateNewCard("generateNewCard");
