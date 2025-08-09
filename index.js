let checkedTiles = Array(25).fill(false);
let WINNINGCOMBOS = [
  [0,1,2,3,4],
  [5,6,7,8,9],
  [10,11,12,13,14],
  [15,16,17,18,19],
  [20,21,22,23,24],
  [0,5,10,15,20],
  [1,6,11,16,21],
  [2,7,12,17,22],
  [3,8,13,18,23],
  [4,9,14,19,24],
  [0,6,12,18,24],
  [4,8,12,16,20]
]

function addEventHandlers(svg){
  document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', event =>{
      toggleCheck(cell, svg, index);
    })
  });
}

function checkForBingo(){
  const winningLine = WINNINGCOMBOS.find(line =>
    line.every(i => checkedTiles[i]));

  if (winningLine) {
    WINNINGCOMBOS = WINNINGCOMBOS.filter(line =>
      line !== winningLine);
    return true;
  }
  return false;
}

function dropConfetti() {
  const colors = ['#ff0','#f0f','#0ff','#0f0','#00f','#f00'];
  const numPieces = 50;

  for (let i = 0; i < numPieces; i++) {
    const conf = document.createElement('div');
    conf.classList.add('confetti');
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 4000);
  }
}

async function loadTiles() {
  try {
    const response = await fetch("./resources/tiles.json");
    console.log("Tiles loaded!");
    return await response.json();
  } catch(err) {
    console.error("error loading tiles")
    return [];
  }
}

function escapeHtml(s){
  const t = document.createElement('div');
  t.textContent = s;
  return t.innerHTML;
}

function fillBoard(tiles) {
  const cells = document.querySelectorAll(".cell");
  let tileIndex = 0;

  cells.forEach((cell, index) => {
    if (index === 12) return;
    cell.innerHTML = `<p>${tiles[tileIndex].toUpperCase()}</p>`;
    tileIndex++;
  })
}

async function getSVG(){
  const svgRes = await fetch('./resources/oxide-check.svg');
  if (!svgRes.ok){
    throw new Error('Failed to get svg');
  }
  return await svgRes.text();
}

function toggleCheck(cell, svg, index) {
  const overlay = cell.querySelector('.overlay');
  if (overlay) {
    overlay.remove();                 // remove the node
    cell.classList.remove('checked');
    index === 12 ? checkedTiles[index] = true : checkedTiles[index] = false;
  }else{
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = svg;
    cell.appendChild(overlay);
    cell.classList.add('checked');
    index === 12 ? checkedTiles[index] = true : checkedTiles[index] = true;
  }

  if (checkForBingo()){
    winStreak("BINGO!");
    dropConfetti();
  }
}

function shuffleTiles(array){
  for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function winStreak(message = "BINGO!") {
  if (document.getElementById("win-streak-overlay")) return;

  if (!document.getElementById("win-streak-styles")) {
    const css = `
#win-streak-overlay{
  position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:9999;
}
.win-streak{
  position:absolute; left:50%; top:50%;
  transform:translate(-50%,-50%) translateY(-110%);
  display:flex; align-items:center; justify-content:center;
  padding:1rem 3rem; border-radius:9999px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 15%, rgba(72,213,151,0.25) 50%, rgba(255,255,255,0.15) 85%, transparent 100%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  color:#afbac4; text-shadow:0 2px 10px rgba(0,0,0,0.6);
  font: 800 clamp(16px, 6vw, 48px) system-ui, sans-serif;
  white-space: nowrap;
  animation: win-sweep 1800ms ease-out forwards, win-fade 1800ms ease-out forwards;
}
@keyframes win-sweep {
  0%   { transform:translate(-50%,-50%) translateY(-110%); }
  100% { transform:translate(-50%,-50%) translateY(110%); }
}
@keyframes win-fade {
  0% { opacity:0; }
  15% { opacity:1; }
  85% { opacity:1; }
  100% { opacity:0; }
}`;
    const style = document.createElement("style");
    style.id = "win-streak-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  const overlay = document.createElement("div");
  overlay.id = "win-streak-overlay";
  overlay.innerHTML = `<div class="win-streak">${escapeHtml(message)}</div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
}




(async function main(){
  checkedTiles[12] = true;
  const tiles = shuffleTiles(await loadTiles());
  fillBoard(tiles);
  const svg = await getSVG();
  addEventHandlers(svg);
})();

