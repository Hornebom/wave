import { snoise } from './snoise.js'

const vertexShaderSource = `
  uniform float u_delta;
  
  attribute vec4 a_position;
  attribute vec4 a_index;
  attribute mat4 a_matrix;
  
  ${snoise}

  void main() {
    // density controls how many octaves are drawn
    // smaller means less octaves
    float density = 0.02;
    float noise = snoise( vec3(u_delta - a_index * density) + vec3(a_position.xyz) );
    vec4 noise_position = vec4(1.0, noise, 1.0, 1.0);

    gl_Position = a_matrix * a_position * noise_position;
  }
`
const fragmentShaderSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  void main() {
    gl_FragColor = vec4(0.9, 0.5, 1.0, 1.0);
  }
`

export { vertexShaderSource, fragmentShaderSource }
