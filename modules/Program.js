function Program(gl, vertexShaderSource, fragmentShaderSource ) {
  this.program = gl.createProgram()
  
  gl.attachShader(
    this.program,
    compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  )
  gl.attachShader(
    this.program,
    compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
  )

  gl.linkProgram(this.program)
  gl.useProgram(this.program)

  function compileShader(shaderSource, shaderType) {
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    return shader
  }
}

export { Program }
