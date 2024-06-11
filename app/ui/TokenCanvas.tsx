'use client'
import React, { useEffect, useRef } from 'react';

function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  const promises = urls.map((url) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  return Promise.all(promises);
}

async function loadFont(fontName:string, url: string) {
  const font = new FontFace(fontName, `url(${url})`, {});
  await font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
  });
}


export function TokenCanvas(
  {
    reminderCount = 0,
    affectsSetup = false,
    firstNight = false,
    otherNights = false,
    name = "Unmade",
    ability = "Once before the game, define an ability here.",
    componentURLBase = "/components/",
    diameter = 256
  }: {
    reminderCount?: number,
    affectsSetup?: boolean,
    firstNight?: boolean,
    otherNights?: boolean,
    name?: string,
    ability?: string,
    componentURLBase?: string,
    diameter: number
  }) {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let middle = diameter / 2;
      ctx.font = "48px serif";
      ctx.textAlign = "center"
      ctx.textBaseline = "hanging";
      ctx.strokeText("Loading...", middle, middle);

      const imageUrls = [
        `${componentURLBase}/tokenBG.webp`,
        `${componentURLBase}/Leaf1.webp`,
        `${componentURLBase}/Leaf2.webp`,
        `${componentURLBase}/Leaf3.webp`,
        `${componentURLBase}/Leaf4.webp`,
        `${componentURLBase}/Leaf5.webp`,
        `${componentURLBase}/Leaf6.webp`,
        `${componentURLBase}/Leaf7.webp`,
        `${componentURLBase}/LeafLeft.webp`,
        `${componentURLBase}/LeafRight.webp`,
        `${componentURLBase}/SetupFlower.webp`,
      ];
      const images = preloadImages(imageUrls);
      images.then((images) => {
        // Clear out the loading image
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

        // Start with the token background. The scale required to fit this image will be applied to all the other components.
        const scaleFactor = diameter / images[0].width;
        const scaledMiddle = middle / scaleFactor;
        const scaledDiameter = diameter / scaleFactor;

        ctx.save()
        ctx.scale(scaleFactor, scaleFactor)
        ctx.drawImage(images[0], 0, 0)

        // Mask the image to a circle
        ctx.beginPath();
        ctx.arc(scaledMiddle, scaledMiddle, scaledMiddle, 0, 2 * Math.PI);
        ctx.clip();
        ctx.closePath();

        // Add the leaves
        function drawLeaf(image: HTMLImageElement, offsetPercent: number) {
          ctx.drawImage(image, scaledMiddle-(image.width/2)+(scaledDiameter*offsetPercent), 0)
        }
        switch (reminderCount) {
          case 7:
            drawLeaf(images[7], -0.15);
          case 6:
            drawLeaf(images[6], 0.15);
          case 5:
            drawLeaf(images[5], -0.10);
          case 4:
            drawLeaf(images[4], 0.10);
          case 3:
            drawLeaf(images[3], 0.05);
          case 2:
            drawLeaf(images[2], -0.05);
          case 1:
            drawLeaf(images[1], 0);
          default:
            break;
        }

        // Don't forget the first night and other night markers
        if (firstNight) {
          ctx.drawImage(images[8], 0, scaledMiddle-(images[8].height/2))
        }
        if (otherNights) {
          ctx.drawImage(images[9], scaledDiameter-images[9].width, scaledMiddle-(images[9].height/2))
        }

        // Add the setup flower if needed
        if (affectsSetup) {
          ctx.drawImage(images[10], scaledDiameter-(images[10].width), scaledDiameter*.625)
        }

        // Now add the name 
        function drawTextAlongArc(str: string, centerX: number, centerY: number, radius: number, angle: number) {
          var len = str.length
          var s: string;
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(-1 * angle / 2);
          ctx.rotate(-1 * (angle / len) / 2);
          for(var n = 0; n < len; n++) {
            ctx.rotate(angle / len);
            ctx.save();
            ctx.translate(0, -1 * radius);
            s = str[n];
            ctx.fillText(s, 0, 0);
            ctx.restore();
          }
          ctx.restore();
        }
        const font = new FontFace("RoleName", `url(${componentURLBase}/RoleName.woff2)`, {});
        font.load().then((loadedFont) => {
          document.fonts.add(loadedFont);
          ctx.font = "96px RoleName";
          drawTextAlongArc(name, scaledMiddle, scaledMiddle, scaledMiddle*0.75, Math.PI)
        });

        // ...and the ability text
        ctx.font = "48px RoleName";
        ctx.fillText(ability, scaledMiddle, scaledMiddle*0.25);

        // Reset our context
        ctx.restore()

      }).catch((error) =>{
          ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
          ctx.font = "12px serif";
          ctx.fillText("Error: "+error, middle, middle);
      });
    }
  }, []);

  return <canvas ref={canvasRef} width={diameter} height={diameter} />;

}