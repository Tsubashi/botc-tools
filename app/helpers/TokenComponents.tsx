type TokenComponents = {
  tokenBG: HTMLImageElement;
  leaves: HTMLImageElement[];
  firstNightLeaf: HTMLImageElement;
  otherNightLeaf: HTMLImageElement;
  setupFlower: HTMLImageElement;
  font: {[key: string]: FontFace};
};

export async function loadComponents(baseUrl: string) {
  // Prep our return object
  const components: TokenComponents = {
    tokenBG: new Image(),
    leaves: [],
    setupFlower: new Image(),
    firstNightLeaf: new Image(),
    otherNightLeaf: new Image(),
    font: {}
  };

  // Load the Images
  const imageUrls = [
    `${baseUrl}/tokenBG.webp`,
    `${baseUrl}/Leaf1.webp`,
    `${baseUrl}/Leaf2.webp`,
    `${baseUrl}/Leaf3.webp`,
    `${baseUrl}/Leaf4.webp`,
    `${baseUrl}/Leaf5.webp`,
    `${baseUrl}/Leaf6.webp`,
    `${baseUrl}/Leaf7.webp`,
    `${baseUrl}/LeafLeft.webp`,
    `${baseUrl}/LeafRight.webp`,
    `${baseUrl}/SetupFlower.webp`,
  ];
  const imgPromises = imageUrls.map((url) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  const images = await Promise.all(imgPromises)
  components.tokenBG = images[0];
  components.leaves = images.slice(1, 8);
  components.firstNightLeaf = images[8];
  components.otherNightLeaf = images[9];
  components.setupFlower = images[10];

  // Load the Fonts
  components.font = {};
  const fontsToLoad = {
    RoleName: `${baseUrl}/RoleName.woff2`,
    AbilityText: `${baseUrl}/AbilityText.woff2`,
    ReminderText: `${baseUrl}/ReminderText.woff2`,
  };

  const fontPromises = Object.entries(fontsToLoad).map(async ([fontName, url]) => {
    return new Promise<FontFace>((resolve, reject) => {
      const font = new FontFace(fontName, `url(${url})`, {});
      font.load()
      font.loaded.then(() => {
        document.fonts.add(font);
        components.font[fontName] = font;
        resolve(font);
      }).catch(() => reject(`Font failed to load: ${url}`));
    });
  }); 

  // Wait for all fonts to be loaded
  await Promise.all(fontPromises);

  return components;
}
