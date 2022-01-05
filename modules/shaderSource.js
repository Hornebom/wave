import { snoise } from './snoise.js'

const vertexShaderSource = `
  attribute vec4 a_position;
  // attribute vec4 color;
  attribute mat4 matrix;
  uniform float u_delta;

  varying vec4 v_color;

  void main() {
    // Multiply the position by the matrix.
    gl_Position = matrix * a_position;

    // Pass the vertex color to the fragment shader.
    // v_color = color;
  }
`
const fragmentShaderSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  // Passed in from the vertex shader.
  // varying vec4 v_color;

  void main() {
    // gl_FragColor = v_color;
    gl_FragColor = vec4(0.9, 0.5, 1.0, 1.0);
  }
`

export { vertexShaderSource, fragmentShaderSource }
