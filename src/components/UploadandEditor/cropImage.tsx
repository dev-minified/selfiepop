const fillColor = 'white';
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

/**
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number },
  rotation = 0,
) {
  if (!pixelCrop) throw new Error('Invalid Croped Data');

  const rawImg = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let { width: cropWidth, height: cropHeight, x: cropX, y: cropY } = pixelCrop;

  if (!ctx) throw new Error('Error while creating context');

  if (rotation) {
    // make canvas to cover the rotated image
    const { naturalWidth: rawWidth, naturalHeight: rawHeight } = rawImg;

    let boxSize = Math.sqrt(Math.pow(rawWidth, 2) + Math.pow(rawHeight, 2));
    let imgWidth = rawWidth;
    let imgHeight = rawHeight;

    // fit the long image
    if (boxSize > 4096) {
      const ratio = 4096 / boxSize;

      boxSize = 4096;
      imgWidth = rawWidth * ratio;
      imgHeight = rawHeight * ratio;

      cropWidth = cropWidth * ratio;
      cropHeight = cropHeight * ratio;
      cropX = cropX * ratio;
      cropY = cropY * ratio;
    }

    canvas.width = boxSize;
    canvas.height = boxSize;

    // rotate image
    const half = boxSize / 2;
    ctx.translate(half, half);
    ctx.rotate((Math.PI / 180) * rotation);
    ctx.translate(-half, -half);

    // draw rotated image to canvas center
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, boxSize, boxSize);

    const imgX = (boxSize - imgWidth) / 2;
    const imgY = (boxSize - imgHeight) / 2;

    ctx.drawImage(
      rawImg,
      0,
      0,
      rawWidth,
      rawHeight,
      imgX,
      imgY,
      imgWidth,
      imgHeight,
    );
    const rotatedImg = ctx.getImageData(0, 0, boxSize, boxSize);

    // resize canvas to crop size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    ctx.putImageData(rotatedImg, -(imgX + cropX), -(imgY + cropY));
  } else {
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    ctx.drawImage(
      rawImg,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );
  }
  // As Base64 string
  return canvas.toDataURL('image/jpeg');

  // As a blob
  // return new Promise((resolve, reject) => {
  //   canvas.toBlob((blob) => {
  //     resolve(blob);
  //   }, 'image/jpeg');
  // });
}

/**
 * @param {string} url - The source image
 * @param {number} aspectRatio - The aspect ratio
 * @return {Promise<HTMLCanvasElement>} A Promise that resolves with the resulting image as a canvas element
 */
export function crop(
  url: string,
  aspectRatio: number,
): Promise<HTMLCanvasElement> {
  // we return a Promise that gets resolved with our canvas element
  return new Promise((resolve) => {
    // this image will hold our source image data
    const inputImage = new Image();

    // we want to wait for our image to load
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio;
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = 0; //(outputHeight - inputHeight) * 0.5

      // create a canvas that will present the output image
      const outputImage = document.createElement('canvas');

      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext('2d');
      ctx?.drawImage(inputImage, outputX, outputY);
      resolve(outputImage);
    };

    // start loading our image
    inputImage.src = url;
  });
}
