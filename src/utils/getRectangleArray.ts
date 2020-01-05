export default function(x = 0, y = 0, width = 100, height = 100): number[] {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  return [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
}
