function Buffer({ gl, program, data, size, name, mode, type }) {
  const length = data.length / size
  const buffer = gl.createBuffer()
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

  const location = gl.getAttribLocation(program, name)

  this.draw = () => {
    gl.enableVertexAttribArray(location)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
    
    if(type === 'elements') {
      gl.drawElements(gl[mode], 6, gl.UNSIGNED_SHORT, 0)
    } else {
      gl.drawArrays(gl[mode], 0, length)
    }
  }
}

export { Buffer }
