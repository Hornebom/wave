
import { Program } from './Program.js'
import { vertexShaderSource, fragmentShaderSource } from './shaderSource.js'

function Lines({ gl, extension, size = 3, gap = 40 } = {}) {
  const { program } = new Program(gl, vertexShaderSource, fragmentShaderSource)

  let positionBuffer
  let matrices
  let matrixBuffer
  let matrixData
  let indexBuffer
  let vertexCount
  let instanceCount
  let instanceOffsets

  const deltaLoc = gl.getUniformLocation(program, "u_delta")
  const positionLoc = gl.getAttribLocation(program, 'a_position')
  const matrixLoc = gl.getAttribLocation(program, 'a_matrix')
  
  const indexLoc = gl.getAttribLocation(program, "a_index")

  let vertices

  
  bindBuffer()

  function getVertices({ size, width }) {
    const normalizedWidth = (size / width) * 2

    const x1 = normalizedWidth * -0.5
    const x2 = normalizedWidth * 0.5
    const y1 = 1.0
    const y2 = 0.0

    return [
      x1, y1,
      x2, y2,
      x1, y2,
  
      x1, y1,
      x2, y1,
      x2, y2
    ]
  }

  function getInstanceOffsets({ size, width, count }) {
    const normalizedStart = (size * .5 / width) * 2 
    const normalizedGap = (((width - size) / (count - 1)) / (width - size) - ((size / width) / (count - 1))) * 2 

    const offsets = []
    for(let i = 0; i < count; i++) {

      offsets.push(-1 + normalizedStart + (normalizedGap * i))
    }

    return offsets
  }
  
  function bindBuffer() {
    const { width } = gl.canvas
    
    // setup matrices, one per instance
    instanceCount = 1 + Math.floor((width - size) / gap)    
    vertices = getVertices({ size, width })
    instanceOffsets = getInstanceOffsets({ size, width, count: instanceCount })
  
    positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    vertexCount = vertices.length / 2
  

    
    
    /////////////////////// 
    // Translation matrix for each instance
    ///////////////////////
    const numFloatsForView = 16
    matrixData = new Float32Array(instanceCount * numFloatsForView)
    matrices = new Array(instanceCount).fill(0).map((_, index) => {
      const byteOffsetToMatrix = index * numFloatsForView * 4
      const matrix = new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView)
      m4.translation(instanceOffsets[index], 0, 0, matrix)
      return matrix
    })
  
    matrixBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW)
  
    
    const indexes = new Array(instanceCount).fill(0).map((_, index) => index)
    indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(indexes),
      gl.STATIC_DRAW)
  }

  this.draw = (delta) => {
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(deltaLoc, delta)


    // upload the new matrix data
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

    // set all 4 attributes for matrix
    const bytesPerMatrix = 4 * 16
    for (let i = 0; i < 4; ++i) {
      const loc = matrixLoc + i
      gl.enableVertexAttribArray(loc)
      // note the stride and offset
      const offset = i * 16;  // 4 floats per row, 4 bytes per float
      gl.vertexAttribPointer(
          loc,              // location
          4,                // size (num values to pull from buffer per iteration)
          gl.FLOAT,         // type of data in buffer
          false,            // normalize
          bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
          offset,           // offset in buffer
      );
      // this line says this attribute only changes for each 1 instance
      extension.vertexAttribDivisorANGLE(loc, 1)
    }


    
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
    gl.enableVertexAttribArray(indexLoc)
    gl.vertexAttribPointer(indexLoc, 1, gl.FLOAT, false, 0, 0)
    extension.vertexAttribDivisorANGLE(indexLoc, 1)

    extension.drawArraysInstancedANGLE(
      gl.TRIANGLES,
      0,             // offset
      vertexCount,   // num vertices per instance
      instanceCount,  // num instances
    );

  }

  this.update = () => {
    bindBuffer()
  }
}

export { Lines }

