'use client'
import React, { useEffect, useRef } from 'react';
import { loadComponents } from '../helpers/TokenComponents';
import { drawAbilityText } from '../helpers/AbilityText'
import { drawRoleName } from '../helpers/RoleName'

//  As of 21 June 2024...
//
//                    *** ### ### ***
//                *##        |        ##*
//            *##            |            ##*
//         *##    Ability Text starts at     ##*
//       *##               0.25r               ##*
//     *##                   |                   ##*
//    *##                   ---                   ##*
//   *##         ...and extends no further         ##*
//  *##                  than 0.70r                 ##*
//  *##                                 r           ##*
//  *##                      |----------------------##*
//  *##                                             ##*
//  *##                                             ##*
//   *##                                        ---##*----
//    *##                                         ##*| Role name will not extend higher
//     *##                                       ##* | than 0.4r from the bottom
//       *##    Role name extends no further   ##*   |
//         *#       than 0.35r from edge     ##*     |
//            *##            -            ##*        |
//                *##        |        ##*            |
//                    *** ### ### ***-----------------



/** A canvas object that draws a character token, given a set of props. */
export function RoleToken(
  {
    reminderCount = 0,
    affectsSetup = false,
    firstNight = false,
    otherNights = false,
    name = "Unmade",
    ability = "Once before the game, define an ability here.",
    componentURLBase = "/components/default",
    diameter = 256,
    iconURL = ""
  }: {
    reminderCount?: number,
    affectsSetup?: boolean,
    firstNight?: boolean,
    otherNights?: boolean,
    name?: string,
    ability?: string,
    componentURLBase?: string,
    diameter: number,
    iconURL?: string
  }) {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.reset()
    let middle = diameter / 2;
    ctx.font = "48px serif";
    ctx.textAlign = "center"
    ctx.textBaseline = "hanging";
    ctx.strokeText("Loading...", middle, middle);

    // Preload our components
    loadComponents(componentURLBase, iconURL).then((comp) => {
      // Reset any transformations and clear out the loading image
      ctx.reset()

      // Start with the token background. The scale required to fit this image will be applied to all the other components.
      const scaleFactor = diameter / comp.tokenBG.width;
      const scaledMiddle = middle / scaleFactor;
      const radius = scaledMiddle;
      const scaledDiameter = diameter / scaleFactor;

      ctx.save()
      {
        ctx.scale(scaleFactor, scaleFactor)
        ctx.drawImage(comp.tokenBG, 0, 0)

        // Mask the image to a circle
        ctx.beginPath();
        ctx.arc(scaledMiddle, scaledMiddle, radius, 0, 2 * Math.PI);
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
        drawRoleName(ctx, name, scaledMiddle)

        // ...and the ability text
        drawAbilityText(ctx, ability, scaledMiddle)
      
        // ...and now the icon. We calculate our bounding box based on where we expect the ability text and name to be.
        const iconTopY = radius * 0.7
        const iconBottomY = radius * 1.65
        const iconMiddleY = (iconBottomY - iconTopY) / 2 + iconTopY
        const maxIconHeight = iconBottomY - iconTopY
        const maxIconWidth = radius * 1.85
        const iconScale = Math.min(maxIconHeight / comp.icon.height, maxIconWidth / comp.icon.width)
        const iconWidth = comp.icon.width * iconScale
        const iconHeight = comp.icon.height * iconScale

        ctx.drawImage(comp.icon, scaledMiddle-(iconWidth/2), iconMiddleY-(iconHeight/2), iconWidth, iconHeight)
      }
      // Reset our context
      ctx.restore()

    }).catch((error) =>{
        // Reset any transformations and clear out previous display
        ctx.reset()

        // Print our error message
        ctx.font = "12px serif";
        ctx.fillText("Error: "+error, middle, middle);
        throw error;
    });
  }, [reminderCount, affectsSetup, firstNight, otherNights, name, ability, componentURLBase, diameter, iconURL]);

  return <canvas ref={canvasRef} width={diameter} height={diameter} />;

}