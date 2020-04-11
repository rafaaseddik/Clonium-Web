export const MAX_WIDTH = 8;
export const MAX_HEIGHT = 8;
const INITIAL_BOARD = Array(MAX_HEIGHT).fill(Array(MAX_WIDTH).fill(false));

export function RectangularLayout(width: number, height: number): boolean[][] {
  if (width <= 0 || width > MAX_WIDTH) {
    throw new RangeError(`Width must be between 1 and ${MAX_WIDTH} inclusive`);
  }
  if (height <= 0 || height > MAX_HEIGHT) {
    throw new RangeError(`Height must be between 1 and ${MAX_HEIGHT} inclusive`);
  }

  let offset_x = Math.floor((MAX_WIDTH - width) / 2);
  let offset_y = Math.floor((MAX_HEIGHT - height) / 2);

  return INITIAL_BOARD.map((row, y) => row.map((cell, x) => {

    if (x < offset_x || y < offset_y || (x - offset_x) >= width || (y - offset_y) >= height) {
      return false;
    } else {
      return true;
    }

  }));
}
