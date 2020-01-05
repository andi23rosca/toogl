import IUniformTypes from "../types/IUniformTypes";

export default function getUniformTypes(
  gl: WebGLRenderingContext
): IUniformTypes {
  return {
    f1: gl["uniform1f"],
    f2: gl["uniform2f"],
    f3: gl["uniform3f"],
    f4: gl["uniform4f"],
    f1v: gl["uniform1fv"],
    f2v: gl["uniform2fv"],
    f3v: gl["uniform3fv"],
    f4v: gl["uniform4fv"],
    i1: gl["uniform1i"],
    i2: gl["uniform2i"],
    i3: gl["uniform3i"],
    i4: gl["uniform4i"],
    i1v: gl["uniform1iv"],
    i2v: gl["uniform2iv"],
    i3v: gl["uniform3iv"],
    i4v: gl["uniform4iv"],
    matrixf2v: gl["uniformMatrix2fv"],
    matrixf3v: gl["uniformMatrix3fv"],
    matrixf4v: gl["uniformMatrix4fv"]
  };
}
