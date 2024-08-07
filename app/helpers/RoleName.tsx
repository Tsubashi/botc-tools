/**
* Draw the role's name on the lower portion of the token.
* @param ctx The context to draw on
* @param str The Role's name
* @param radius The radius of the token
*/
export function drawRoleName(ctx: CanvasRenderingContext2D, str: string, radius: number) {
 // Save the existing context, so we can restore it after we're done.
 ctx.save();
 { 
   // Setup the initial font. Font size is proportional to the token's radius
   var fontSize = radius * 0.25;
   ctx.font = fontSize + "px RoleName";
   ctx.letterSpacing = "10px";
   ctx.textBaseline = "bottom";
   ctx.shadowColor="grey";
   ctx.shadowBlur=10;
   ctx.shadowOffsetY = 5;
   ctx.shadowOffsetX = 5;

   // Since we don't want the text at the very edge, scale the text radius down
   const textRadius = radius * 0.85;

   // Determine if we have enough room for the current font size. If the string would overflow, scale down the font.
   var textLength = ctx.measureText(str).width;
   const maxTextLength = radius * Math.PI * 0.75;  // The Role Name should only use part of the lower half of the token. 
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
   
   // Start in the center of our circle
   ctx.translate(radius, radius);
   // Orient ourselves at the starting point for our text
   ctx.rotate(textAngle / 2);
   for(var n = 0; n < len; n++) {  // Loop through each letter, so we can adjust the angle as needed
     // We store and reset the context for each letter so that we can rotate and extend from the center of the 
     // circle each time instead of trying to calculate the curve in situ.
     ctx.save();  
     {
       ctx.rotate(-letterAngle[n]);  
       ctx.translate(0, textRadius);
       s = str[n];
       ctx.fillText(s, 0, 0);
     }
     ctx.restore();
   }

   // Restore the context from before we were called.
 }
 ctx.restore();
}