import IGLConstructorOptions from "./types/IGLConstructorOptions";
import resizeGL from "./utils/resizeGL";
import createShader from "./utils/createShader";
import createProgram from "./utils/createProgram";
import fullscreenVertexShaderSource from "./utils/fullscreenVertexShaderSource";
import setupArrayBuffer from "./utils/setupArrayBuffer";
import getRectangleArray from "./utils/getRectangleArray";
import isPowerof2 from "./utils/isPowerOf2";

export default class TooGL {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement | OffscreenCanvas;
  size: [number, number] = [0, 0];
  vertexShader: WebGLShader | undefined;
  fragmentShader: WebGLShader | undefined;
  program: WebGLProgram | undefined;

  uniforms: {
    [key: string]: {
      update: Function;
    };
  } = {};

  textures: {
    [key: string]: {
      offset: number;
    };
  } = {};
  _textureOffset: number = -1;

  constructor({ gl, size, shader }: IGLConstructorOptions) {
    if (!gl) {
      throw new Error("WEBGL is not supported");
    }
    this.gl = gl;
    this.canvas = gl.canvas;
    this.resize(size);

    this.vertexShader = createShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      fullscreenVertexShaderSource
    );

    this.setupProgram(shader);
  }

  //Resizes canvas and viewport
  resize(size: [number, number]) {
    this.size = size;
    resizeGL(this.gl, this.size);
  }

  setupProgram(shader: string) {
    this.fragmentShader = createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      shader
    );

    if (this.vertexShader && this.fragmentShader) {
      this.program = createProgram(
        this.gl,
        this.vertexShader,
        this.fragmentShader
      );
      if (this.program) {
        this.gl.useProgram(this.program);
        this.initializeInputs();
      }
    }
  }

  initializeInputs() {
    //Setup texture coordinates
    if (this.program) {
      setupArrayBuffer(this.gl, this.program, "a_texCoord");
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([
          0.0,
          0.0,
          1.0,
          0.0,
          0.0,
          1.0,
          0.0,
          1.0,
          1.0,
          0.0,
          1.0,
          1.0
        ]),
        this.gl.STATIC_DRAW
      );

      //Setup positions
      setupArrayBuffer(this.gl, this.program, "a_position");
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(getRectangleArray(0, 0, ...this.size)),
        this.gl.STATIC_DRAW
      );

      //Setup resolution
      const resolutionLocation = this.gl.getUniformLocation(
        this.program,
        "u_resolution"
      );
      this.gl.uniform2f(resolutionLocation, ...this.size);
    }
  }

  render() {
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
  }

  addUniform(name: string, glFunction: Function) {
    if (this.program) {
      const location = this.gl.getUniformLocation(this.program, name);
      this.uniforms[name] = {
        update: (...args: any[]) => {
          glFunction.call(this.gl, location, ...args);
        }
      };
    }
  }
  updateUniform(name: string, ...args: any[]) {
    this.uniforms[name].update(...args);
  }

  addTexture(name: string, image: TexImageSource) {
    this._textureOffset++;

    this.textures[name] = {
      offset: this._textureOffset
    };

    this.addUniform(name, this.gl.uniform1i);
    const texture = this.gl.createTexture();
    this.gl.activeTexture(this.gl.TEXTURE0 + this._textureOffset);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );
    if (isPowerof2(image.width) && isPowerof2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR
      );
    }
    this.updateUniform(name, this._textureOffset);
  }
}
