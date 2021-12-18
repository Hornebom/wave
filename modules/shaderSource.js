const vertexShaderSource = `
  attribute vec4 a_vertex;

  void main() {
    gl_Position = a_vertex;
  }
`
const fragmentShaderSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  void main() {
    gl_FragColor = vec4( vec3(0.0), 1.0);
  }
`

export { vertexShaderSource, fragmentShaderSource }
