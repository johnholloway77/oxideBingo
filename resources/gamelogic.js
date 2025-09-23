import { dropConfetti, winStreak, getSVG } from "./ui.js";

let checkedTiles = localStorage.getItem("oxideBingoChecked");
if (checkedTiles) {
  checkedTiles = JSON.parse(checkedTiles);
} else {
  checkedTiles = Array(25).fill(false);
}
checkedTiles[12] = true;

let WINNINGCOMBOS = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export function addEventHandlers(svg) {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    if (index === 12) {
      return;
    }
    cell.addEventListener("click", () => {
      toggleCheck(cell, svg, index);
    });
  });
}

export function checkForBingo() {
  const winningLine = WINNINGCOMBOS.find((line) =>
    line.every((i) => checkedTiles[i])
  );

  if (winningLine) {
    WINNINGCOMBOS = WINNINGCOMBOS.filter((line) => line !== winningLine);
    return true;
  }
  return false;
}

export function fillBoard(tiles) {
  const cells = document.querySelectorAll(".cell");
  let tileIndex = 0;
  let tilesAssigned = [];

  cells.forEach((cell, index) => {
    if (index === 12) {
      return;
    }
    cell.innerHTML = `<p>${tiles[tileIndex].toUpperCase()}</p>`;
    tilesAssigned.push(tiles[tileIndex]);
    tileIndex++;
  });

  saveTiles(tilesAssigned);
}

export async function loadTiles() {
  try {
    const response = await fetch("./tiles.json");
    return await response.json();
  } catch (err) {
    console.error("error loading tiles");
    return [];
  }
}

export function shuffleTiles(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleCheck(cell, svg, index) {
  const overlay = cell.querySelector(".overlay");
  if (overlay) {
    overlay.remove(); // remove the node
    cell.classList.remove("checked");
    index === 12 ? (checkedTiles[index] = true) : (checkedTiles[index] = false);
  } else {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = svg;
    cell.appendChild(overlay);
    cell.classList.add("checked");
    index === 12 ? (checkedTiles[index] = true) : (checkedTiles[index] = true);
  }

  saveChecked();

  if (checkForBingo()) {
    winStreak("BINGO!");
    dropConfetti();
  }
}

function saveTiles(tiles) {
  localStorage.setItem("oxideBingoTiles", JSON.stringify(tiles));
  localStorage.setItem("oxideBingoTime", JSON.stringify(Date.now()));
}

function saveChecked() {
  localStorage.setItem("oxideBingoChecked", JSON.stringify(checkedTiles));
}

function setChecked(svg) {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    if (index === 12) {
      return;
    }

    if (checkedTiles[index]) {
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = svg;
      cell.appendChild(overlay);
      cell.classList.add("checked");
    }
  });

  saveChecked();
}

export async function checkTimestamp(oxideBingoTime) {
  const currentTime = Date.now();
  const timeDifference = currentTime - oxideBingoTime;

  if (timeDifference < 10800000) {
    console.log("Game state saved within three hours");
    await reloadTiles();
  } else {
    console.log("previous time expired");
    await newGame();
  }
}

async function reloadTiles() {
  let tiles = localStorage.getItem("oxideBingoTiles");

  if (tiles) {
    checkedTiles = localStorage.getItem("oxideBingoChecked");
    if (checkedTiles) {
      checkedTiles = JSON.parse(checkedTiles);
    } else {
      checkedTiles = Array(25).fill(false);
    }
    checkedTiles[12] = true;

    tiles = JSON.parse(tiles);
    fillBoard(tiles);
    const svg = await getSVG();
    setChecked(svg);
  } else {
    await newGame();
  }
}

export async function newGame() {
  localStorage.clear();
  const tiles = shuffleTiles(await loadTiles());
  checkedTiles = Array(25).fill(false);
  checkedTiles[12] = true;
  localStorage.setItem("oxideBingoChecked", JSON.stringify(checkedTiles));
  fillBoard(tiles);
}
