function InstancedBuffer({ gl, ex, program, positionData }) {
  const buffer = gl.createBuffer()
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData.byteLength, gl.DYNAMIC_DRAW)

  const location = gl.getAttribLocation(program, 'matrix')

  const bytesPerMatrix = 4 * 16;

  this.draw = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionData)

    ex.drawArraysInstancedANGLE(
      gl.TRIANGLES,
      0,             // offset
      4, // numVertices,   // num vertices per instance
      5 // numInstances,  // num instances
    )

    for (let i = 0; i < 4; ++i) {
      const indexed_location = location + i
      gl.enableVertexAttribArray(indexed_location)
  
      const offset = i * 16  // 4 floats per row, 4 bytes per float
      gl.vertexAttribPointer(
        indexed_location,              // location
        4,                // size (num values to pull from buffer per iteration)
        gl.FLOAT,         // type of data in buffer
        false,            // normalize
        bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
        offset          // offset in buffer
      )
      // this line says this attribute only changes for each 1 instance
      ex.vertexAttribDivisorANGLE(indexed_location, 1)
    }
  }
}

export { InstancedBuffer }
