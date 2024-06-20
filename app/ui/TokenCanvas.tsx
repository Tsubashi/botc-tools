'use client'
import React, { useEffect, useRef } from 'react';
import { loadComponents } from '../helpers/TokenComponents';

export function TokenCanvas(
  {
    reminderCount = 0,
    affectsSetup = false,
    firstNight = false,
    otherNights = false,
    name = "Unmade",
    ability = "Once before the game, define an ability here.",
    componentURLBase = "/components/default",
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
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.reset()
    let middle = diameter / 2;
    ctx.font = "48px serif";
    ctx.textAlign = "center"
    ctx.textBaseline = "hanging";
    ctx.strokeText("Loading...", middle, middle);

    // Preload our components
    loadComponents(componentURLBase).then((comp) => {
      // Reset any transformations and clear out the loading image
      ctx.reset()

      // Start with the token background. The scale required to fit this image will be applied to all the other components.
      const scaleFactor = diameter / comp.tokenBG.width;
      const scaledMiddle = middle / scaleFactor;
      const scaledDiameter = diameter / scaleFactor;

      ctx.save()
      ctx.scale(scaleFactor, scaleFactor)
      ctx.drawImage(comp.tokenBG, 0, 0)

      // Mask the image to a circle
      ctx.beginPath();
      ctx.arc(scaledMiddle, scaledMiddle, scaledMiddle, 0, 2 * Math.PI);
      ctx.clip();
      ctx.closePath();

      // Add the leaves
      const drawLeaf = async (image: HTMLImageElement, offsetPercent: number) => {
        ctx.drawImage(image, scaledMiddle-(image.width/2)+(scaledDiameter*offsetPercent), 0)
      }
      // Fall through to draw all the leaves cumulatively
      switch (reminderCount) {
        case 7:
          drawLeaf(comp.leaves[6], -0.15);
        case 6:
          drawLeaf(comp.leaves[5], 0.15);
        case 5:
          drawLeaf(comp.leaves[4], -0.10);
        case 4:
          drawLeaf(comp.leaves[3], 0.10);
        case 3:
          drawLeaf(comp.leaves[2], 0.05);
        case 2:
          drawLeaf(comp.leaves[1], -0.05);
        case 1:
          drawLeaf(comp.leaves[0], 0);
        default:
          break;
      }

      // Don't forget the first night and other night markers
      if (firstNight) {
        ctx.drawImage(comp.firstNightLeaf, 0, scaledMiddle-(comp.firstNightLeaf.height/2))
      }
      if (otherNights) {
        ctx.drawImage(comp.otherNightLeaf, scaledDiameter-comp.otherNightLeaf.width, scaledMiddle-(comp.otherNightLeaf.height/2))
      }

      // Add the setup flower if needed
      if (affectsSetup) {
        ctx.drawImage(comp.setupFlower, scaledDiameter-(comp.setupFlower.width), scaledDiameter*.625)
      }

      // Now add the name 
      function drawRoleName(str: string, radius: number) {
        // Set the correct font. Font size is proportional to the circle's radius
        var fontSize = radius * 0.25;
        ctx.font = fontSize + "px RoleName";
        ctx.textBaseline = "bottom";
        ctx.shadowColor="grey";
        ctx.shadowBlur=10;
        ctx.shadowOffsetY = 5;
        ctx.shadowOffsetX = 5;

        // Since we don't want the text at the very edge, scale the text radius down
        const textRadius = radius * 0.9;

        // Calculate the total angle based on the length of the string. If it would overflow, scale down the font.
        var textLength = ctx.measureText(str).width;
        // We never want text larger than 40% of the circle
        const maxTextLength = radius * Math.PI * 0.8;  // (2 * pi * r) * 0.4  = pi * r * 0.8
        while (textLength > maxTextLength) {  
          fontSize = fontSize * maxTextLength / textLength;
          ctx.font = fontSize + "px RoleName";
          var textLength = ctx.measureText(str).width;
        }

        // Calculate the angle needed based on the text length.
        const textAngle = textLength / textRadius;

        // Calculate the amount of rotation for each charater by determining its x position. This lets us account
        // for kerning and other font spacing gotchas. If we start at the end of the string, we can repeatedly 
        // segment it to find where each character should be placed. 
        var len = str.length;
        const letterAngle:number[] = []
        for(var n = len; n > 0; n--) {
          const segment = str.slice(n-1, len);
          const segmentLength = ctx.measureText(segment).width;
          const pos = textLength - segmentLength;
          const charAngle = (pos / textLength) * textAngle;
          letterAngle.unshift(charAngle);
        }

        //const increment = angle / len
        var s: string;
        // Save our current context, so we can restore it after we're done
        ctx.save();
        
        // Start in the center of our circle
        ctx.translate(radius, radius);
        // Orient ourselves at the starting point for our text
        ctx.rotate(textAngle / 2);
        for(var n = 0; n < len; n++) {  // Loop through each letter, so we can adjust the angle as needed
          // We store and reset the context for each letter so that we can rotate and extend from the center of the 
          // circle each time instead of trying to calculate the curve in situ.
          ctx.save();  
          ctx.rotate(-letterAngle[n]);  
          ctx.translate(0, textRadius);
          s = str[n];
          console.log(`Drawing ${s} at ${letterAngle[n]}`)
          ctx.fillText(s, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }
      drawRoleName(name, scaledMiddle)

      // ...and the ability text
      ctx.font = "48px RoleName";
      ctx.fillText(ability, scaledMiddle, scaledMiddle*0.25);

      // Reset our context
      ctx.restore()

    }).catch((error) =>{
        // Reset any transformations and clear out previous display
        ctx.reset()

        // Print our error message
        ctx.font = "12px serif";
        ctx.fillText("Error: "+error, middle, middle);
    });
  }, []);

  return <canvas ref={canvasRef} width={diameter} height={diameter} />;

}