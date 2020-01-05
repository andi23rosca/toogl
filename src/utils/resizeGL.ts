export default function(gl: WebGLRenderingContext, size: [number, number]) {
  const [width, height] = size;
  const displayWidth = Math.floor(width);
  const displayHeight = Math.floor(height);

  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }

  gl.viewport(0, 0, ...size);
}
