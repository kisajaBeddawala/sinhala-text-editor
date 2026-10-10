import { wrapText } from './story-export';

export interface MoviePostData {
  images: string[]; // Data URLs
  logo: string | null;
  title: string;
  details: string;
  themeColor: string;
  titleColor: string;
  detailsColor: string;
  titleFontFamily: string;
  detailsFontFamily: string;
  titleAlign: 'left' | 'center' | 'right';
  detailsAlign: 'left' | 'center' | 'right';
  titleSize: number;
  detailsSize: number;
  backgroundColor: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  logoSize: number;
  logoYOffset: number;
  logoXOffset: number;
  logoCircularFrame: boolean;
  titleWeight: number;
  detailsWeight: number;
}

function hexToRgb(hex: string): { r: number, g: number, b: number } {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;

  if (imgRatio > targetRatio) {
    // Image is wider than target
    srcW = img.height * targetRatio;
    srcX = (img.width - srcW) / 2;
  } else {
    // Image is taller than target
    srcH = img.width / targetRatio;
    srcY = (img.height - srcH) / 2;
  }

  ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
}

export async function drawMoviePost(canvas: HTMLCanvasElement, data: MoviePostData) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 1080;
  let h = 1350; // default 4:5
  
  if (data.aspectRatio === '1:1') h = 1080;
  else if (data.aspectRatio === '9:16') h = 1920;
  else if (data.aspectRatio === '16:9') { w = 1920; h = 1080; }

  canvas.width = w;
  canvas.height = h;

  // Background
  ctx.fillStyle = data.backgroundColor;
  ctx.fillRect(0, 0, w, h);

  const imgHeight = h * 0.65; // Top 65% for images

  // Load images
  const loadedImages: HTMLImageElement[] = [];
  for (const src of data.images) {
    const img = new Image();
    img.src = src;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // Skip failed
    });
    if (img.width > 0) loadedImages.push(img);
  }

  // Draw Collage
  if (loadedImages.length === 1) {
    drawImageCover(ctx, loadedImages[0], 0, 0, w, imgHeight);
  } else if (loadedImages.length === 2) {
    drawImageCover(ctx, loadedImages[0], 0, 0, w / 2, imgHeight);
    drawImageCover(ctx, loadedImages[1], w / 2, 0, w / 2, imgHeight);
  } else if (loadedImages.length >= 3) {
    drawImageCover(ctx, loadedImages[0], 0, 0, w, imgHeight / 2);
    drawImageCover(ctx, loadedImages[1], 0, imgHeight / 2, w / 2, imgHeight / 2);
    drawImageCover(ctx, loadedImages[2], w / 2, imgHeight / 2, w / 2, imgHeight / 2);
  }

  // Fade Gradient
  const { r, g, b } = hexToRgb(data.backgroundColor);
  const fade = ctx.createLinearGradient(0, imgHeight * 0.3, 0, imgHeight + 20);
  fade.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
  fade.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.9)`);
  fade.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);

  // Decorative Accent Line
  ctx.fillStyle = data.themeColor;
  ctx.fillRect(80, imgHeight - 20, w - 160, 4);

  // Draw Title
  await document.fonts.ready;
  ctx.fillStyle = data.titleColor;
  ctx.font = `${data.titleWeight} ${data.titleSize}px "${data.titleFontFamily}", sans-serif`;
  ctx.textAlign = data.titleAlign;
  ctx.textBaseline = 'top';
  
  const titleY = imgHeight + 20;
  const titleX = data.titleAlign === 'center' ? w / 2 : (data.titleAlign === 'left' ? 80 : w - 80);
  
  const titleLines = wrapText(ctx, data.title, w - 160);
  titleLines.forEach((line, i) => {
    ctx.fillText(line, titleX, titleY + i * (data.titleSize * 1.25));
  });

  const detailsY = titleY + titleLines.length * (data.titleSize * 1.25) + 30;

  // Draw Details
  ctx.fillStyle = data.detailsColor;
  ctx.font = `${data.detailsWeight} ${data.detailsSize}px "${data.detailsFontFamily}", sans-serif`;
  ctx.textAlign = data.detailsAlign;
  const detailLines = wrapText(ctx, data.details, w - 160);
  const detailsX = data.detailsAlign === 'center' ? w / 2 : (data.detailsAlign === 'left' ? 80 : w - 80);
  detailLines.forEach((line, i) => {
    ctx.fillText(line, detailsX, detailsY + i * (data.detailsSize * 1.4));
  });

  // Draw Logo
  if (data.logo) {
    const logoImg = new Image();
    logoImg.src = data.logo;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });

    if (logoImg.width > 0) {
      const logoW = data.logoSize;
      const logoH = (logoImg.height / logoImg.width) * logoW;
      const logoX = (w - logoW) / 2 + data.logoXOffset;
      const logoY = h - logoH - data.logoYOffset;

      if (data.logoCircularFrame) {
        const cx = logoX + logoW / 2;
        const cy = logoY + logoH / 2;
        const radius = Math.min(logoW, logoH) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
        ctx.restore();
      } else {
        ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      }
    }
  }
}
