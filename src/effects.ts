const gridElement: HTMLElement | null = document.getElementById("grid");
const explodeBtn: HTMLElement | null = document.getElementById("explodeBtn");
const regenBtn: HTMLElement | null = document.getElementById("regenBtn");
const wrapBox: HTMLElement = document.getElementsByClassName("wrapBox")[0] as HTMLElement || null;

const TOTAL_CELLS: number = 25;
const STAGGER: number = 100;

type Ring = {
  element: HTMLElement;
  distance: number;
  delay?: number;
}

type Rank = {
  element: HTMLElement;
  y: number;
}

function buildGrid(): void {

  gridElement!.innerHTML = "";
  document.body.classList.remove("exploding", "raining");

  for (let i: number = 0; i < TOTAL_CELLS; i++) {
    const bingoCell: HTMLDivElement = document.createElement("div");
    const asciiBorder: HTMLPreElement = document.createElement("pre");
    const cellContent: HTMLDivElement = document.createElement("div");

    bingoCell.className = "ascii-card";
    asciiBorder.className = "ascii-border";
    asciiBorder.id = `border_${i}`;
    cellContent.className = "content";
    cellContent.innerText= "test text";

    bingoCell.appendChild(asciiBorder);
    asciiBorder.appendChild(cellContent);
    gridElement?.appendChild(bingoCell);
  }
  requestAnimationFrame((): void => {
    void rainIn();
  })
}

function translateToNearestEdge(fromX: number, fromY: number, dirX: number, dirY: number, vw: number, vh: number) {

  // if X or Y directions are equal to zero, we'll swap them with the smallest number allowed
  const dx: number = dirX === 0 ? 1e-6 : dirX;
  const dy: number = dirY === 0 ? 1e-6 : dirY;

  // calculate to nearest edge. Find the distance from the origin or from the viewheight or viewWidth
  const transX1: number = (0 - fromX) / dx;
  const transX2: number = (vw - fromX) / dx;
  const transY1: number = (0 - fromY) / dy;
  const transY2: number = (vh - fromY) / dy;

  const transOverZero: number[] = [transX1, transX2, transY1, transY2].filter((t: number): boolean => t > 0);
  if (transOverZero.length === 0) {
    return 0;
  }
  const smallestTrans = Math.min(...transOverZero);
  return smallestTrans * 1.1;
}

function computeCenterOutDelays(): Ring[] {
  const cells: Element[] = Array.from(gridElement!.children);
  const rect: DOMRect = gridElement!.getBoundingClientRect();
  const cellX: number = rect.left + rect.width / 2;
  const cellY: number = rect.top + rect.height / 2;

  const rings: Ring[] = cells.map((el: Element): Ring => {
    const r: DOMRect = el.getBoundingClientRect();
    const elementX: number = r.left + r.width / 2;
    const elementY: number = r.top + r.height / 2;
    const distance: number = Math.hypot(elementX - cellX, elementY - cellY);
    return {element: el as HTMLElement, distance};
  });

  const maxDistance: number = Math.max(...rings.map((o: Ring): number => o.distance)) || 1;

  rings.forEach((o: Ring): void => {
    o.delay = (o.distance / maxDistance);
  })

  return rings;
}

async function explode(): Promise<void> {
  const cells: Element[] = Array.from(gridElement!.children);
  if (!cells.length) return;

  const viewHeight: number = window.innerHeight;
  const viewWidth: number = window.innerWidth;

  // const wrapRect: DOMRect = wrapBox.getBoundingClientRect();
  const screenCenterX: number = viewWidth / 2;
  const screenCenterY: number = viewHeight / 2;

  document.body.classList.add("exploding");
  const rings: Ring[] = computeCenterOutDelays();

  rings.forEach((ring: Ring): void => {
    const r: DOMRect = ring.element.getBoundingClientRect();
    const eX: number = r.left + r.width / 2;
    const eY: number = r.top + r.height / 2;

    const vectorX: number = eX - screenCenterX;
    const vectorY: number = eY - screenCenterY;
    const length: number = Math.hypot(vectorX, vectorY) || 1;
    const uX: number = vectorX / length;
    const uY: number = vectorY / length;

    const nearestEdge = translateToNearestEdge(eX, eY, uX, uY, viewWidth, viewHeight);

    const rotation: number = Math.random() * 160 - 80;
    const z: number = Math.random() * 100;

    ring.element.style.transitionDelay = `${Math.round(ring.delay! * STAGGER)}ms`;
    ring.element.style.transform = `translate3d(${uX * nearestEdge}px, ${
        uY * nearestEdge}px, ${z}px) rotate(${rotation}deg)`;
    ring.element.style.opacity = "0";
  });

  const longest: number = parseTime(
      getComputedStyle(document.documentElement).getPropertyValue(
          "--explode-time"
      )
  ) || 800;
  const maxDelay: number = Math.max(...rings.map((ring: Ring): number => ring.delay!)) * STAGGER;
  await wait(longest + maxDelay + 40);

  gridElement!.innerHTML = "";
  document.body.classList.remove("exploding");
  await wait(30);
  buildGrid();
}

async function rainIn(): Promise<void> {
  const cells: Element[] = Array.from(gridElement!.children);
  if (!cells.length) return;

  document.body.classList.add("raining");

  const rect: DOMRect = gridElement!.getBoundingClientRect();

  cells.forEach((el: Element, index: number): void => {
    const r: DOMRect = el.getBoundingClientRect();
    const distanceAbove =
        Math.random() * (window.innerHeight * 0.7) + window.innerHeight * 0.3;
    const hEl: HTMLElement = el as HTMLElement;
    hEl.style.transition = "none";
    hEl.style.transform = `translate3d(0, ${-distanceAbove}px, 0) rotate(${
        Math.random() * 8 - 4}deg)`;
    hEl.style.opacity = "0";
  });

  void gridElement?.offsetHeight;

  const ranks: Rank[] = cells.map((el: Element) => {
    const r: DOMRect = el.getBoundingClientRect();
    return {element: el as HTMLElement, y: r.top};
  });

  const minY: number = Math.min(...ranks.map((rank: Rank): number => rank.y));
  const maxY: number = Math.max(...ranks.map((rank: Rank): number => rank.y));
  const span: number = Math.max(1, maxY - minY);

  ranks.forEach((rank: Rank) =>{
    const fraction: number = (rank.y - minY) / span;
    const jitter: number = Math.random() * 60;
    rank.element.style.transition = "";
    rank.element.style.transitionDelay = `${Math.round(fraction * 180 + jitter)}ms`;
    rank.element.style.transform = "translate3d(0,0,0) rotate(0deg)";
    rank.element.style.opacity = "1";
  });

  const rainDur: number = parseTime(
      getComputedStyle(document.documentElement).getPropertyValue(
          "--rain-time"
      )
  ) || 700;
  await wait( rainDur + 240);
  document.body.classList.remove("raining");
}

function wait(ms: number): Promise<void> {
  return new Promise((res)=> setTimeout(res, ms));
}

function parseTime(value: string): number {
  if(!value) {
    return 0;
  }

  value = String(value).trim();
  if(value.endsWith("ms")) {
    return parseFloat(value);
  }
  if(value.endsWith("s")){
    return parseFloat(value) * 1000;
  }

  return parseFloat(value) || 0;
}

export function init(): void{
  explodeBtn?.addEventListener("click", explode);
  regenBtn?.addEventListener("click", buildGrid);

  let resizeTimeOut: number | undefined = undefined;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(buildGrid, 150);
  })

  buildGrid();
}