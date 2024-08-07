// Define a few types that we will need later.
type Word = {
  width:number,  // width of the word in pixels
  text:string,   // the actual characters of the word
};

type Line = {
  y:number,      // y position of the line
  width:number,  // width of the line in pixels
  text:string,   // the actual characters of the line
};

/**
* Count the number of characters in a set of words from a starting index to an ending index
* @param words Array of words to use
* @param from The starting index from which to count characters
* @param to The ending index
* @returns Total number of characters in the specified range of words.
*/
function getCharacterCount(words:Word[], from:number, to:number) { 
  var numChars = 0;
  // Sum up all the characters in each word.
  while (from < to) { 
    numChars += words[from].text.length 
    // Check if we still have words to go. If we do, we need to add 1 for the space between them.
    if (from < to) {
      numChars += 1; // space
    }
    // Move to the next word
    from++;
  }
  return numChars;         
}

/**
* Sum up all the widths of the words in a line
* @param words The array of words to use
* @param line The line to sum up
* @returns The width of the line in pixels
*/
function getWidth(words:Word[], line:Line) { // in pixels
  var width = 0;
  var from = line.from;
  const to = line.to
  // Sum up all the pixels in each word.
  while (from < to) { 
    width += words[from].width;
    // Check if we still have words to go. If so, we need to add the width of the space between them.
    if (from < to) {
      width += words[from].space;
    } 
    // Move to the next word
    from++;
  }
  return width;         
}


/**
 * Draw the role's ability text on the upper portion of the token
 * @param ctx The canvas context to draw on
 * @param str The ability text to draw
 * @param radius The radius of the token
 */
export function drawAbilityText(ctx: CanvasRenderingContext2D, str: string, radius: number) {
  // Save the existing context, so we can restore it after we're done.
  ctx.save();
  {
    // Set an initial font size, proportional to the token's radius
    var fontSize = radius * 0.10;
    var fontHeight = fontSize * 1.1;
    ctx.font = fontSize + "px AbilityText";
    ctx.letterSpacing = "0px";
    ctx.textBaseline = "top";
    ctx.textAlign = "center"
    ctx.shadowColor = "grey";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowOffsetX = 5;

    // Declare our starting variables
    const startingY = radius * 0.25;  // Make sure to leave room for the reminder leaves.
    const inset = radius * 0.24;  // Declare an inset, since we don't want the text at the very edge.
    const maxLines = 4;  // Too many lines and we will overlap the token icon.
    var totalWidth = ctx.measureText(str).width;

    // Determine if there is enough room for the current font size. If not, downscale till it fits.
    var tooLong = true;
    const lines:Line[] = [];
    while (tooLong) {
      // Calculate the sum of chord lengths for each line to determine how much available space we have.
      var avialableWidth = 0;
      for (var i = 0; i < maxLines; i++) {
        // Chord length can be calculated by the formula 2 * sqrt(r^2 - (r-h)^2), where r is the radius,
        // and h is the distance from the edge of the circle. Don't forget to subtract the inset.
        const lineY = startingY + (i * fontHeight);
        const lineWidth = (2 * Math.sqrt(Math.pow(radius,2) - Math.pow(radius - lineY, 2))) - (inset * 2);

        avialableWidth += lineWidth;

        // May as well fill in the lines array while we're at it.
        // Since it is a positional assignment (instead of an insert), it will get overwritten if we 
        // need to downscale.
        lines[i] = { 
          y: lineY,
          width: lineWidth,
          text: "" 
        };
      }

      // If the text is too long, we need to scale it down.
      if (totalWidth > avialableWidth) {
        fontSize = fontSize * avialableWidth / totalWidth;
        fontHeight = fontSize * 1.1;
        ctx.font = fontSize + "px AbilityText";
        totalWidth = ctx.measureText(str).width;
      } else {
        tooLong = false;
      }
    }

    // Now that we know we will have enough space, split the text into the appropriate lines.
    const spaceWidth = ctx.measureText(" ").width;
    const words = str.split(" ").map((text) => (
      {
        width: ctx.measureText(text).width, 
        text: text, 
      }               
    ));
    var currentWord = 0;
    for (const line of lines) {
      let currentWidth = 0;
      while ((currentWord < words.length) && (currentWidth + words[currentWord].width < line.width)) {
        currentWidth += words[currentWord].width;
        line.text += words[currentWord].text;
        currentWord++;
        // If we still have words to go, add a space.
        if (currentWord < words.length) {
          currentWidth += spaceWidth;
          line.text += " ";
        }
      }
      // With our line constructed, draw the text.
      ctx.fillText(line.text, radius, line.y);
    }


  }
  // Restore the context from before we were called.
  ctx.restore();
}