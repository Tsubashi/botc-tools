/**
 * Remove transparent pixels from the edges of an image
 * @param image The image to trim
 */
function trimImage(bitmap:ImageBitmap) {
  // Create a canvas
  const canvas = document.createElement('canvas')
  const context:CanvasRenderingContext2D|null = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not get canvas context!')
  }

  const { width, height } = bitmap

  // Get pixels
  canvas.width = width
  canvas.height = height
  context.drawImage(bitmap, 0, 0)
  const { data: pixels } = context.getImageData(0, 0, width, height)
  context.clearRect(0, 0, width, height)

  // Find new bounds by ignoring transparent pixels
  const bounds = { top: height, left: width, right: 0, bottom: 0 }

  for (const row of Array(height).keys()) {
    for (const col of Array(width).keys()) {
      if (pixels[row * width * 4 + col * 4 + 3] !== 0) {
        if (row < bounds.top) bounds.top = row
        if (col < bounds.left) bounds.left = col
        if (col > bounds.right) bounds.right = col
        if (row > bounds.bottom) bounds.bottom = row
      }
    }
  }

  const newWidth = bounds.right - bounds.left
  const newHeight = bounds.bottom - bounds.top

  // Draw new image
  canvas.width = newWidth
  canvas.height = newHeight
  context.drawImage(
    bitmap,
    bounds.left,
    bounds.top,
    newWidth,
    newHeight,
    0,
    0,
    newWidth,
    newHeight,
  )
}