import {dropConfetti, winStreak} from "./ui.js";

let checkedTiles = Array(25).fill(false);
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
  [4, 8, 12, 16, 20]
]

export function addEventHandlers(svg) {
  document.querySelectorAll('.cell').forEach((cell, index) => {
    if (index === 12) {
      return;
    }
    cell.addEventListener('click', event => {
      toggleCheck(cell, svg, index);
    })
  });
}

export function checkForBingo() {
  const winningLine = WINNINGCOMBOS.find(line =>
      line.every(i => checkedTiles[i]));

  if (winningLine) {
    WINNINGCOMBOS = WINNINGCOMBOS.filter(line =>
        line !== winningLine);
    return true;
  }
  return false;
}

export function fillBoard(tiles) {
  const cells = document.querySelectorAll(".cell");
  let tileIndex = 0;

  cells.forEach((cell, index) => {
    if (index === 12) {
      return;
    }
    cell.innerHTML = `<p>${tiles[tileIndex].toUpperCase()}</p>`;
    tileIndex++;
  })
}

export async function loadTiles() {
  try {
    const response = await fetch("./resources/tiles.json");
    console.log("Tiles loaded!");
    return await response.json();
  } catch (err) {
    console.error("error loading tiles")
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
  const overlay = cell.querySelector('.overlay');
  if (overlay) {
    overlay.remove();                 // remove the node
    cell.classList.remove('checked');
    index === 12 ? checkedTiles[index] = true : checkedTiles[index] = false;
  } else {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = svg;
    cell.appendChild(overlay);
    cell.classList.add('checked');
    index === 12 ? checkedTiles[index] = true : checkedTiles[index] = true;
  }

  if (checkForBingo()) {
    winStreak("BINGO!");
    dropConfetti();
  }
}

