import {dropConfetti, winStreak, getSVG} from "./ui";

// Debounced localStorage saves
let saveTimeout: number | undefined;

function debouncedSave(key: string, value: any): void {
  clearTimeout(saveTimeout);
  saveTimeout = window.setTimeout(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, 100);
}

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

// Event delegation - one listener instead of 25!
export function addEventHandlers(svg: string, checkedTiles: boolean[]): void {
  const inner = document.querySelector('.inner');

  // Click handler with event delegation
  inner?.addEventListener('click', (e) => {
    const cell = (e.target as Element).closest('.cell');
    if (!cell) return;

    const index = Array.from(cell.parentElement!.children).indexOf(cell);
    if (index === 12) return; // Free space

    toggleCheck(cell, svg, index, checkedTiles);
  });

  // Keyboard navigation
  inner?.addEventListener('keydown', (e) => {
    const cell = e.target as HTMLElement;
    if (!cell.classList.contains('cell')) return;

    const index = Array.from(cell.parentElement!.children).indexOf(cell);

    // Space or Enter = toggle
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (index !== 12) {
        toggleCheck(cell, svg, index, checkedTiles);
      }
    }

    // Arrow keys = navigate
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      let newIndex = index;

      if (e.key === 'ArrowRight') newIndex++;
      if (e.key === 'ArrowLeft') newIndex--;
      if (e.key === 'ArrowDown') newIndex += 5;
      if (e.key === 'ArrowUp') newIndex -= 5;

      // Keep within bounds
      if (newIndex >= 0 && newIndex < 25) {
        const newCell = cell.parentElement!.children[newIndex] as HTMLElement;
        newCell.focus();
      }
    }
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
  let tileIndex = 0;
  let tilesAssigned: string[] = [];

  cells.forEach((cell, index) => {
    const htmlCell = cell as HTMLElement;

    // Make cells keyboard accessible
    htmlCell.setAttribute('role', 'gridcell');
    htmlCell.setAttribute('tabindex', '0');

    if (index === 12) {
      // Center cell is the free space
      htmlCell.setAttribute('aria-label', 'Free space - center tile');
      htmlCell.setAttribute('aria-pressed', 'true');
      return;
    }

    const tile: string | undefined = tiles[tileIndex];
    if (tile !== undefined) {
      cell.innerHTML = `<p>${tile.toUpperCase()}</p>`;
      htmlCell.setAttribute('aria-label', tile);
      htmlCell.setAttribute('aria-pressed', 'false');
      tilesAssigned.push(tile);
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
  const htmlCell = cell as HTMLElement;

  if (overlay) {
    overlay.remove();
    cell.classList.remove("checked");
    checkedTiles[index] = false;
    htmlCell.setAttribute('aria-pressed', 'false');
  } else {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = svg;
    cell.appendChild(overlay);
    cell.classList.add("checked");
    checkedTiles[index] = true;
    htmlCell.setAttribute('aria-pressed', 'true');
  }

  // Use debounced save
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
  // Use debounced save to avoid blocking on rapid clicks
  debouncedSave("oxideBingoChecked", checkedTiles);
}

function setChecked(svg: string, checkedTiles: boolean[]): void {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    const htmlCell = cell as HTMLElement;

    if (index === 12) {
      return;
    }

    if (checkedTiles[index]) {
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = svg;
      cell.appendChild(overlay);
      cell.classList.add("checked");
      htmlCell.setAttribute('aria-pressed', 'true');
    }
  });

  saveChecked(checkedTiles);
}

export async function checkTimestamp(oxideBingoTime: string): Promise<void> {
  const currentTime: number = Date.now();
  const timeDifference: number = currentTime - Number.parseFloat(oxideBingoTime);
  const svg: string = getSVG(); // Now synchronous!

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

    await newGame();
  }
}

export async function newGame(): Promise<void> {
  localStorage.clear();
  const svg: string = getSVG(); // Now synchronous!
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
