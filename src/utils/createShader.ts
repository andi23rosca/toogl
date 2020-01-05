export default function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader: WebGLShader | null = gl.createShader(type);
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = !!gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  gl.deleteShader(shader);
}
