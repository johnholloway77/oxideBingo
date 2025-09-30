import {dropConfetti, winStreak, getSVG} from "./ui";

// let oxideBingoChecked: string | null = localStorage.getItem("oxideBingoChecked");
// let checkedTiles :boolean[];
// if (oxideBingoChecked) {
//   checkedTiles = JSON.parse(oxideBingoChecked);
// } else {
//   checkedTiles = Array(25).fill(false);
// }
// checkedTiles[12] = true;



let WINNINGCOMBOS: number[][] = [
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

export function addEventHandlers(svg: string, checkedTiles: boolean[]): void {
  document.querySelectorAll(".cell").forEach((cell: Element, index: number): void => {
    if (index === 12) {
      return;
    }
    cell.addEventListener("click", () => {
      toggleCheck(cell, svg, index, checkedTiles);
    });
  });
}

export function checkForBingo(checkedTiles: boolean[]): boolean {
  const winningLine = WINNINGCOMBOS.find((line) =>
      line.every((i) => checkedTiles[i])
  );

  if (winningLine) {
    WINNINGCOMBOS = WINNINGCOMBOS.filter((line) => line !== winningLine);
    return true;
  }
  return false;
}

export function fillBoard(tiles: string[]): void {
  const cells: NodeListOf<Element> = document.querySelectorAll(".cell");
  const contents: NodeListOf<Element> = document.querySelectorAll<Element>(".content");

  console.log(contents)



  let tileIndex = 0;
  let tilesAssigned: string[] = [];

  cells.forEach((cell, index) => {
    if (index === 12) {
      return;
    }

    const tile: string | undefined = tiles[tileIndex];
    if (tile !== undefined) {
      cell.innerHTML = `<p>${tile.toUpperCase()}</p>`;
      tilesAssigned.push(tile);
      tileIndex++;
    }
  });

  tileIndex = 0;
  contents.forEach((cell, index) => {
    if (index === 12){
      return;
    }

    console.log("tile");
    const tile: string | undefined = tiles[tileIndex];
    if(tile !== undefined){
      cell.innerHTML = `<p>${tile.toUpperCase()}</p>`;
      tileIndex++;
    }
  });

  saveTiles(tilesAssigned);
}

export async function loadTiles(): Promise<string[] | null> {
  try {
    const response = await fetch("./tiles.json");
    return await response.json();
  } catch (err) {
    console.error("error loading tiles");
    return null;
  }
}

export function shuffleTiles(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i]!, array[j]!] = [array[j]!, array[i]!];
  }
  return array;
}

function toggleCheck(cell: Element, svg: string, index: number, checkedTiles: boolean[]): boolean[] {
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

  saveChecked(checkedTiles);

  if (checkForBingo(checkedTiles)) {
    winStreak("BINGO!");
    dropConfetti();
  }

  return checkedTiles;
}

function saveTiles(tiles: string[]): void {
  localStorage.setItem("oxideBingoTiles", JSON.stringify(tiles));
  localStorage.setItem("oxideBingoTime", JSON.stringify(Date.now()));
}

function saveChecked(checkedTiles: boolean[]): void {
  localStorage.setItem("oxideBingoChecked", JSON.stringify(checkedTiles));
}

function setChecked(svg: string, checkedTiles: boolean[]): void {
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

  saveChecked(checkedTiles);
}

export async function checkTimestamp(oxideBingoTime: string): Promise<void> {
  const currentTime: number = Date.now();
  const timeDifference: number = currentTime - Number.parseFloat(oxideBingoTime);
  const svg: string = await getSVG();

  if (timeDifference < 10800000) {
    console.log("Game state saved within three hours");
    await reloadTiles(svg);
  } else {
    console.log("previous time expired");
    await newGame();
  }
}

async function reloadTiles(svg: string): Promise<void> {
  let oxideBingoTiles: string | null = localStorage.getItem("oxideBingoTiles");

  if (oxideBingoTiles !== null) {
    let oxideBingoChecked: string | null = localStorage.getItem("oxideBingoChecked");
    let checkedTiles: boolean[];
    if (oxideBingoChecked) {
      checkedTiles = JSON.parse(oxideBingoChecked);
    } else {
      checkedTiles = Array(25).fill(false);
      checkedTiles[12] = true;
    }

    const tiles = JSON.parse(oxideBingoTiles);
    fillBoard(tiles);
    addEventHandlers(svg, checkedTiles);
    setChecked(svg, checkedTiles);

  } else {

   void await newGame();
  }
}

export async function newGame(): Promise<void> {
  localStorage.clear();
  const svg: string = await getSVG();
  const loadedTiles = await loadTiles();

  if (loadedTiles !== null) {
    const tiles = shuffleTiles(loadedTiles);
    const checkedTiles = Array(25).fill(false);
    checkedTiles[12] = true;
    localStorage.setItem("oxideBingoChecked", JSON.stringify(checkedTiles));
    fillBoard(tiles);
    addEventHandlers(svg, checkedTiles);
  }
}
