const MAX_AVATAR_BYTES = 400_000;
const MAX_POST_IMAGE_BYTES = 700_000;

const OUTPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const OUTPUT_QUALITIES = [0.82, 0.7, 0.55] as const;

export type ResizeResult =
  | { ok: true; dataUrl: string; name: string }
  | { ok: false; error: string };

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('That file is not a readable image.'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('That file is not a readable image.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('That file is not a readable image.'));
    image.src = dataUrl;
  });
}

function extensionForType(type: string): string {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}

async function resize(
  file: File,
  options: { maxEdge: number; maxBytes: number }
): Promise<ResizeResult> {
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Please choose an image file.' };
  }

  let image: HTMLImageElement;

  try {
    image = await loadImage(await readAsDataUrl(file));
  } catch {
    return { ok: false, error: 'That file is not a readable image.' };
  }

  const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);

  if (longestEdge === 0) {
    return { ok: false, error: 'That file is not a readable image.' };
  }

  const scale = Math.min(1, options.maxEdge / longestEdge);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    return { ok: false, error: 'Your browser could not process this image.' };
  }

  context.drawImage(image, 0, 0, width, height);

  const baseName = file.name.replace(/\.[^.]+$/, '');

  for (const type of OUTPUT_TYPES) {
    for (const quality of OUTPUT_QUALITIES) {
      const dataUrl = canvas.toDataURL(type, quality);

      if (dataUrl.length <= options.maxBytes) {
        return { ok: true, dataUrl, name: `${baseName}.${extensionForType(type)}` };
      }
    }
  }

  return { ok: false, error: 'That image is too large. Please choose a smaller one.' };
}

export function resizeAvatar(file: File): Promise<ResizeResult> {
  return resize(file, { maxEdge: 256, maxBytes: MAX_AVATAR_BYTES });
}

export function resizePostImage(file: File): Promise<ResizeResult> {
  return resize(file, { maxEdge: 1600, maxBytes: MAX_POST_IMAGE_BYTES });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
