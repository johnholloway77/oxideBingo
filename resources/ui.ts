type HtmlToImage = {
  toBlob: (
      node: HTMLElement,
      options?: { pixelRatio?: number; cacheBust?: boolean; backgroundColor?: string }
  ) => Promise<Blob | null>;
  toJpeg: (
      node: HTMLElement,
      options?: {
        quality?: number;
        pixelRatio?: number;
        cacheBust?: boolean;
        backgroundColor?: string
      }
  ) => Promise<string>;
};

let htmlToImage: HtmlToImage | null = null;

// Inline SVG - no need to fetch it!
const CHECK_SVG = `<svg width="37.491199" height="25.061483" viewBox="0 0 37.491199 25.061483" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="m 8.94141,0 c 1.88649,1.8e-5 3.49879,0.444234 4.83299,1.332034 1.3343,0.88788 2.3531,2.18627 3.0557,3.89453 0.7024,1.70814 1.0527,3.76081 1.0527,6.16112 v 2.2852 c 0,2.4003 -0.3503,4.4529 -1.0527,6.1611 -0.7026,1.7083 -1.7214,3.0066 -3.0557,3.8945 -1.3342,0.8879 -2.9464,1.333 -4.83299,1.333 -1.88656,0 -3.49876,-0.4452 -4.83301,-1.333 -1.33429,-0.8879 -2.35313,-2.1862 -3.05567,-3.8945 C 0.350293,18.125784 1.7e-5,16.073184 0,13.672884 v -2.2852 C 3.7e-5,8.987334 0.350272,6.934714 1.05273,5.226564 1.75527,3.518294 2.77411,2.219914 4.1084,1.332034 5.44263,0.444274 7.05489,3e-6 8.94141,0 Z m 28.51559,9.172854 -6.1103,6.57713 6.1445,6.7149 -2.416,2.2851 -6.0762,-6.6123 -6.042,6.6123 -2.3818,-2.2851 6.1797,-6.6807 -6.1797,-6.57715 2.417,-2.31934 6.1103,6.50779 5.9727,-6.50779 z M 4.47949,19.470684 c 0.10882,0.2281 0.22681,0.442 0.35352,0.6406 0.89758,1.4071 2.26668,2.1114 4.1084,2.1114 1.84169,-10e-5 3.20529,-0.7026 4.09079,-2.1114 0.8855,-1.407 1.3291,-3.5533 1.3291,-6.4384 v -2.2852 c 0,-0.8603 -0.0393,-1.6549 -0.1181,-2.38378 z M 8.94141,2.837894 c -1.84167,0 -3.21082,0.70435 -4.1084,2.11132 -0.89755,1.40706 -1.34664,3.55348 -1.34668,6.43847 v 2.2852 c 0,1.0269 0.05719,1.9601 0.1709,2.7998 L 13.5098,5.881834 C 13.3681,5.541624 13.2092,5.230404 13.0322,4.949214 12.1467,3.542314 10.783,2.837924 8.94141,2.837894 Z" fill="#48d597"/>
</svg>`;

export function addGenerateNewCard(buttonId: string): void {
  const btn: HTMLElement | null = document.getElementById(buttonId);

  if (!btn) {
    return;
  }
  btn.addEventListener('click', (): void => {
    localStorage.clear();
    window.location.reload();
  })
}

export function addImageCopy(buttonId: string, targetId: string): void {
  const btn: HTMLElement | null = document.getElementById(buttonId);

  if (!btn) {
    return;
  }
  btn.addEventListener('click', async (): Promise<void> => {
    const originalText = btn.textContent;

    try {
      // Show loading state
      btn.textContent = 'Copying...';
      (btn as HTMLButtonElement).disabled = true;

      if (!htmlToImage) {
        htmlToImage = await import('https://unpkg.com/html-to-image@1.11.11/es/index.js');
      }
      const target: HTMLElement | null = document.getElementById(targetId);
      if (!target) {
        console.error("No target");
        showToast('Error: Could not find card');
        return;
      }

      // Get the actual rendered dimensions
      const rect = target.getBoundingClientRect();

      const blob = await htmlToImage.toBlob(target, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#000000',
        width: rect.width,
        height: rect.height,
        style: {
          margin: '0',
          padding: '0',
        },
      });
      if (!blob) {
        throw new Error('Renderer did not produce binary blob');
      }

      await navigator.clipboard.write([
        new ClipboardItem({'image/png': blob})
      ]);

      showToast('Card copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy card');
    } finally {
      // Reset button
      btn.textContent = originalText;
      (btn as HTMLButtonElement).disabled = false;
    }
  });
}

export function addImageDownload(buttonId: string, targetId: string): void {
  const btn: HTMLElement | null = document.getElementById(buttonId);

  if (!btn) {
    return;
  }
  btn.addEventListener('click', async (): Promise<void> => {
    const originalText = btn.textContent;

    try {
      // Show loading state
      btn.textContent = 'Downloading...';
      (btn as HTMLButtonElement).disabled = true;

      if (!htmlToImage) {
        const mod = await import('https://unpkg.com/html-to-image@1.11.11/es/index.js');
        htmlToImage = mod as HtmlToImage;
      }
      const target = document.getElementById(targetId);
      if (!target) {
        console.error("No target");
        showToast('Error: Could not find card');
        return;
      }

      // Get the actual rendered dimensions
      const rect = target.getBoundingClientRect();

      const dataUrl: string = await htmlToImage.toJpeg(target, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#000000',
        width: rect.width,
        height: rect.height,
        style: {
          margin: '0',
          padding: '0',
        },
      });

      const downloadLink: HTMLAnchorElement = document.createElement('a');
      downloadLink.download = "bingo-card.jpeg";
      downloadLink.href = dataUrl;
      downloadLink.click();

      showToast('Download started!');
    } catch (err) {
      console.error('Failed to generate image file:', err);
      showToast('Failed to download card');
    } finally {
      // Reset button
      btn.textContent = originalText;
      (btn as HTMLButtonElement).disabled = false;
    }
  });
}

// Canvas-based confetti for better performance
export function dropConfetti(): void {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const colors = ['#48d597', '#5ee5a8', '#3bc57f', '#2ea56f', '#1f9561'];

  interface ConfettiPiece {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    size: number;
  }

  const pieces: ConfettiPiece[] = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)]!,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 6 + 4,
  }));

  function animate(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(piece => {
      piece.y += piece.vy;
      piece.x += piece.vx;
      piece.rotation += piece.rotationSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.restore();
    });

    if (pieces.some(p => p.y < canvas.height)) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}

// No need to fetch - SVG is inlined!
export function getSVG(): string {
  return CHECK_SVG;
}

// Toast notification system
export function showToast(message: string, duration = 2000): void {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Need a frame delay for CSS transition to work
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Hide and remove after duration
  setTimeout(() => {
    toast.classList.remove('show');

    // Wait for fade-out animation, then remove from DOM
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function escapeHtml(s: string): string {
  const t: HTMLDivElement = document.createElement('div');
  t.textContent = s;
  return t.innerHTML;
}

export function winStreak(message = "BINGO!"): void {
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

  overlay.addEventListener("animationend", (): void => overlay.remove(),
      {once: true});
}