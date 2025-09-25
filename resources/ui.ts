type HtmlToImage = {
  toBlob: (
      node: HTMLElement,
      options?: {pixelRatio?: number; cacheBust?: boolean; backgroundColor?:string}
  ) => Promise<Blob | null>;
  toJpeg:(
      node: HTMLElement,
      options?: {quality?: number; pixelRatio?: number; cacheBust?: boolean; backgroundColor?:string}
  ) => Promise<string>;
};

let htmlToImage: HtmlToImage | null = null;

export function addGenerateNewCard(buttonId :string) :void{
  const btn :HTMLElement | null  = document.getElementById(buttonId);

  if(!btn){return;}
  btn.addEventListener('click', () :void =>{
    localStorage.clear();
    window.location.reload();
  })
}

export function addImageCopy(buttonId :string, targetId :string) :void {
  const btn :HTMLElement | null  = document.getElementById(buttonId);

  if(!btn){return;}
  btn.addEventListener('click', async ():Promise<void> => {
    if (!htmlToImage) {
      htmlToImage = await import('https://unpkg.com/html-to-image@1.11.11/es/index.js');
    }
    const target :HTMLElement|null = document.getElementById(targetId);
    if (!target) {
      console.error("No target");
      return;
    }

    const blob = await htmlToImage.toBlob(target, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#000000',
    });
    if (!blob) {
      throw new Error('Renderer did not produce binary blob');
    }

    await navigator.clipboard.write([
      new ClipboardItem({'image/png': blob})
    ]);
    console.log("Card copied to clipboard");
  });
}

export function addImageDownload(buttonId :string, targetId :string) :void {
  const btn :HTMLElement | null  = document.getElementById(buttonId);

  if(!btn){return;}
  btn.addEventListener('click', async () :Promise<void> => {

    if (!htmlToImage) {
      const mod = await import('https://unpkg.com/html-to-image@1.11.11/es/index.js');
      htmlToImage = mod as HtmlToImage;
    }
    const target = document.getElementById(targetId);
    if (!target) {
      console.error("No target");
      return;
    }

    try {
      const dataUrl:string = await htmlToImage.toJpeg(target, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#000000',
      });

      const downloadLink :HTMLAnchorElement = document.createElement('a');
      downloadLink.download = "bingo-card.jpeg";
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (err) {
      console.error('Failed to generate image file:', err);
    }

  });
}

export function dropConfetti() :void {
  const colors :string[] = ['#ff0', '#f0f', '#0ff', '#0f0', '#00f', '#f00'];
  const numPieces = 50;

  for (let i: number = 0; i < numPieces; i++) {
    const conf :HTMLDivElement = document.createElement('div');
    conf.classList.add('confetti');
    const idx :number = Math.floor(
        Math.random() * colors.length);
    conf.style.backgroundColor = colors[idx] ?? '#000';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(conf);

    setTimeout(() :void => conf.remove(), 4000);
  }
}

export async function getSVG() : Promise<string> {
  const svgRes = await fetch('./oxide-check.svg');
  if (!svgRes.ok) {
    throw new Error('Failed to get svg');
  }
  return await svgRes.text();
}

function escapeHtml(s :string):string {
  const t:HTMLDivElement = document.createElement( 'div');
  t.textContent = s;
  return t.innerHTML;
}

export function winStreak(message = "BINGO!") :void {
  if (document.getElementById("win-streak-overlay")) {
    return;
  }

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

  overlay.addEventListener("animationend", () :void => overlay.remove(),
      {once: true});
}