/**
 * Compresses and crops an image file using an HTML5 canvas.
 * @param {string} imageSrc - The base64 or object URL of the original image.
 * @param {Object} croppedAreaPixels - The crop dimensions {x, y, width, height}.
 * @param {number} maxWidth - The maximum width (default 256).
 * @param {number} maxHeight - The maximum height (default 256).
 * @param {number} quality - The JPEG quality from 0 to 1 (default 0.8).
 * @returns {Promise<string>} - The base64 representation of the compressed/cropped image.
 */
export const compressImage = (imageSrc, croppedAreaPixels = null, maxWidth = 256, maxHeight = 256, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (croppedAreaPixels) {
        sourceX = croppedAreaPixels.x;
        sourceY = croppedAreaPixels.y;
        sourceWidth = croppedAreaPixels.width;
        sourceHeight = croppedAreaPixels.height;
      }

      let targetWidth = sourceWidth;
      let targetHeight = sourceHeight;

      if (targetWidth > targetHeight) {
        if (targetWidth > maxWidth) {
          targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
          targetWidth = maxWidth;
        }
      } else {
        if (targetHeight > maxHeight) {
          targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
          targetHeight = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, targetWidth, targetHeight
      );

      const base64Data = canvas.toDataURL('image/jpeg', quality);
      resolve(base64Data);
    };

    img.onerror = (error) => reject(error);
  });
};

export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};
