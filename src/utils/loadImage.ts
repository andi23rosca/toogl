export default function loadImage(url: string) {
  return new Promise((res, rej) => {
    try {
      const image = new Image();
      image.crossOrigin = "";
      image.addEventListener("load", () => {
        res(image);
        image.remove();
      });
      image.src = url;
    } catch (e) {
      rej(e);
    }
  });
}
