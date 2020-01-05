# **toogl**: 2D WEBGL made easy

**toogl** is a JavaScript library that enables easily rendering 2D canvases with WebGL. It hides away all the messiness of the WEBGL API such as dealing with programs and vertex shaders/buffers and lets you focus on your fragment shaders.

## Installation

```
npm install toogl
```

## Use

The most basic example to get you started:

```javascript
import { TooGL } from "toogl";

//get webgl context -> assumes there's a canvas with the id of "c"
const gl = document.getElementById("c").getContext("webgl");
const size = [400, 300]; // [width,height] of the canvas

//fragment shader, outputs the color red
const shader = `
precision mediump float;
void main(){
	gl_FragColor = vec4(1,0,0,1);
}
`;

//create a new TooGL instance
const app = new TooGL({ gl, size, shader }); // All three params are required.
app.render(); //Renders the scene
```

### Helpers

Showing the color red is not too exciting, but fortunately, **toogl** exposes more useful things for you to use.

#### Coordinates

Internally, **toogl** manages a vertex shader which defines a rectangle that covers the whole canvas screen. The most common thing you would need from the vertex shader inside of the fragment shader are the coordinates at which each run of the fragment shader is performed at.

There is a variable called `v_coords` which is passed from the vertex shader which you can make use of in your fragment shader:

```
precision mediump float;
varying vec2 v_coords; //vec2 since it holds x and y
void main(){
	gl_FragColor = vec4(v_coords,0,1); //v_coords go from 0 -> 1 on both axes
}
```

Output of the shader:

<img src="https://github.com/andi23rosca/toogl/blob/master/images/coords.png" alt="image-20200105220723502" style="zoom:50%;" />

#### Uniforms

It is very easy to send variables to your shaders. For this, there are 2 functions exposed by toogl:

##### addUniform

Add uniform is a function which accepts 2 arguments:

- **name** - unique string identifier

- **glFunction** - a webgl function for updating the uniform value

  There are 2 ways to pass down this function. Let's take the case of passing a float.

  1. Through your gl context

     `app.addUniform("myFloat", gl.uniform1f)`;

  2. Through uniform types exposed by the TooGL instance

     `app.addUniform("myFloat", app.UTYPES.f1);`

  They are both equivalent.

##### updateUniform

Once a uniform was added, you can update it through this function.

```
app.updateUniform("myFloat", 2);
```

**Full example:**

```javascript
import { TooGL } from "toogl";
const gl = document.getElementById("c").getContext("webgl");
const size = [400, 300];

const shader = `
precision mediump float;
uniform vec2 u_mouse;
void main(){
	gl_FragColor = vec4(u_mouse,0,1);
}
`;

const app = new TooGL({ gl, size, shader });
app.addUniform("u_mouse", app.UTYPES.f2);

window.addEventListener("mousemove", e => {
  //Normalizing coordinates to be between 0 and 1.
  const normalizedX = e.clientX / window.innerWidth;
  const normalizedY = e.clientY / window.innerHeight;
  app.updateUniform("u_mouse", normalizedX, normalizedY); //Updating vec2 float with 2 values

  //Render everytime there is an update
  app.render();
});
app.render();
```

#### Textures

**toogl** also makes it easy to load images as textures through the function `addTexture`

It accepts a name string and any `ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas`

```javascript
import { TooGL } from "toogl";
const gl = document.getElementById("c").getContext("webgl");
const size = [400, 400];
const shader = `
precision mediump float;
varying vec2 v_coords;
uniform sampler2D u_myTexture;

void main() {
    //shader will display the texture stretched fully onto the canvas
    gl_FragColor = texture2D(u_myTexture, v_coords); 
}
`;
const app = new TooGL({
  gl,
  size,
  shader
});
//Load image
const image = new Image();
image.crossOrigin = "";
image.addEventListener("load", () => {
  app.addTexture("u_myTexture", image); //loaded image is added as a texture
  app.render(); //Don't forget to render
});
image.src = "https://webglfundamentals.org/webgl/resources/f-texture.png";
```

Multiple textures can be loaded and you can also overwrite textures.

#### Structs

Structs are the glsl (or C++) equivalent of JavaScript objects. Since it is useful to sometimes bundle uniforms together into objects, **toogl** provides an easy way to define and update your structs.

On the JavaScript side you can use the method `addStruct` which accepts a name and a config object:

```javascript
app.addStruct("u_modifiers", {
  contrast: app.UTYPES.f1,
  brightness: app.UTYPES.f1
});
```

The config object should contain keys that define the properties of the struct, and the values of the keys should be gl uniform values (the same as when adding a uniform). In this case both contrast and brighness are floats.

To update the values there are 2 ways you can do it.

1. Update the whole object

   ```javascript
   app.updateStruct("u_modifiers", {
     contrast: 2,
     brightness: 0.5
   });
   ```

2. Update one property at a time

   ```
   app.updateUniform("u_modifiers.contrast", 1.2);
   ```

On the shader side, you need to define the struct, and also the uniform which will use the struct type.

```
precision mediump float;

varying vec2 v_coords;

//The struct type
struct ModifiersStruct {
	float contrast;
	float brightness;
};

//The uniform which contains the values being passed
uniform ModifiersStruct u_modifiers

void main() {
    //shader will display the texture stretched fully onto the canvas
    vec2 modified = v_coords * vec2(u_modifiers.contrast); //accessing the contrast
    gl_FragColor = vec4(modified, 0, 1)
}
```

## Done

That's it. If you feel like something is missing from the library's API you have the option to use the `gl` rendering context to do custom stuff manually. Or you could make a pull request with the changes to this repo.
