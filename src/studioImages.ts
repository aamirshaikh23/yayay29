import { MAX_FRAME_IMAGE_LENGTH } from './studioModel';
import type { FrameImage } from './studioModel';

export function frameImageRect(sourceWidth: number, sourceHeight: number, width: number, height: number, fit: FrameImage['fit']) {
  const scale = fit === 'Contain' ? Math.min(width / sourceWidth, height / sourceHeight) : Math.max(width / sourceWidth, height / sourceHeight);
  return { x: (width - sourceWidth * scale) / 2, y: (height - sourceHeight * scale) / 2, width: sourceWidth * scale, height: sourceHeight * scale };
}

export async function prepareFrameImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size > 10_000_000) throw new Error('Choose an image smaller than 10 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('This image could not be opened. Try another JPEG, PNG, or WebP.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    let longest = Math.min(1024, Math.max(image.naturalWidth, image.naturalHeight));
    if (!longest) throw new Error('This image has no usable dimensions.');
    do {
      const scale = longest / Math.max(image.naturalWidth, image.naturalHeight);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not prepare the frame picture.');
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const src = canvas.toDataURL('image/jpeg', .8);
      if (src.startsWith('data:image/jpeg;base64,') && src.length <= MAX_FRAME_IMAGE_LENGTH) return src;
      longest = Math.floor(longest / 2);
    } while (longest >= 128);
    throw new Error('This picture could not be made small enough to save. Choose a smaller image.');
  } finally { URL.revokeObjectURL(url); }
}
