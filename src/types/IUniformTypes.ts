export default interface IUniformTypes {
  f1: WebGLRenderingContext["uniform1f"];
  f2: WebGLRenderingContext["uniform2f"];
  f3: WebGLRenderingContext["uniform3f"];
  f4: WebGLRenderingContext["uniform4f"];
  f1v: WebGLRenderingContext["uniform1fv"];
  f2v: WebGLRenderingContext["uniform2fv"];
  f3v: WebGLRenderingContext["uniform3fv"];
  f4v: WebGLRenderingContext["uniform4fv"];
  i1: WebGLRenderingContext["uniform1i"];
  i2: WebGLRenderingContext["uniform2i"];
  i3: WebGLRenderingContext["uniform3i"];
  i4: WebGLRenderingContext["uniform4i"];
  i1v: WebGLRenderingContext["uniform1iv"];
  i2v: WebGLRenderingContext["uniform2iv"];
  i3v: WebGLRenderingContext["uniform3iv"];
  i4v: WebGLRenderingContext["uniform4iv"];
  matrixf2v: WebGLRenderingContext["uniformMatrix2fv"];
  matrixf3v: WebGLRenderingContext["uniformMatrix3fv"];
  matrixf4v: WebGLRenderingContext["uniformMatrix4fv"];
}
