export default function isPowerof2(n: number) {
  return (n & (n - 1)) == 0;
}
