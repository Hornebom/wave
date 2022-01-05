
import { Program } from './Program.js'
import { vertexShaderSource, fragmentShaderSource } from './shaderSource.js'

function Lines({ gl, extension, size = 3, gap = 40 } = {}) {
  const { program } = new Program(gl, vertexShaderSource, fragmentShaderSource)

  let positionBuffer
  let matrices
  let matrixBuffer
  let matrixData
  let colorBuffer
  let numVertices
  let numInstances
  let instanceOffsets

  const positionLoc = gl.getAttribLocation(program, 'a_position');
  // const colorLoc = gl.getAttribLocation(program, 'color');
  const matrixLoc = gl.getAttribLocation(program, 'matrix');
  const deltaLoc = gl.getUniformLocation(program, "u_delta")

  let vertices

  // const colors = [
  //   1, 0, 0, 1,  // red
  //   0, 1, 0, 1,  // green
  //   0, 0, 1, 1,  // blue
  //   1, 0, 1, 1,  // magenta
  //   0, 1, 1, 1,  // cyan
  // ]

  
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

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
  }

  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2
  }
  
  function bindBuffer() {
    const { width } = gl.canvas
    
    // setup matrices, one per instance
    numInstances = 1 + Math.floor((width - size) / gap)    
    vertices = getVertices({ size, width })
    instanceOffsets = getInstanceOffsets({ size, width, count: numInstances })
  
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    numVertices = vertices.length / 2
  

    
    
    /////////////////////// 
    // Translation matrix for each instance
    ///////////////////////
    const numFloatsForView = 16
    matrixData = new Float32Array(numInstances * numFloatsForView)
    matrices = new Array(numInstances).fill(0).map((_, index) => {
      const byteOffsetToMatrix = index * numFloatsForView * 4
      const matrix = new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView)
      // m4.translation(instanceOffsets[index], 0, 0, matrix)
      // m4.zRotate(matrix, Math.PI, matrix)
      // m4.scale(matrix, 1, .5, 1, matrix)
      return matrix
    })
  
    matrixBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    // just allocate the buffer
    gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
  


    // setup colors, one per instance
    // colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER,
    //   new Float32Array(colors),
    //   gl.STATIC_DRAW);
  }
  
  const numOctaves = 4
  noise.seed(4)

  this.draw = (timeStamp) => {
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(deltaLoc, timeStamp)

    
    matrices.forEach((mat, ndx) => {

      // const progress = noise.perlin2(timeStamp - ndx * .04, ndx * .02) // !!!!!!!
      const progress = noise.simplex2(timeStamp - ndx * .01, ndx * .01)
      const z_rotation = progress >= 0 ? 0 : Math.PI
      
      m4.translation(instanceOffsets[ndx], 0, 0, mat)
      m4.zRotate(mat, z_rotation, mat)
      m4.scale(mat, 1, Math.abs(progress), 1, mat)
    })

    // upload the new matrix data
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

    // set all 4 attributes for matrix
    const bytesPerMatrix = 4 * 16;
    for (let i = 0; i < 4; ++i) {
      const loc = matrixLoc + i;
      gl.enableVertexAttribArray(loc);
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
      extension.vertexAttribDivisorANGLE(loc, 1);
    }


    // set attribute for color
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.enableVertexAttribArray(colorLoc);
    // gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    // // this line says this attribute only changes for each 1 instance
    // extension.vertexAttribDivisorANGLE(colorLoc, 1);

    extension.drawArraysInstancedANGLE(
      gl.TRIANGLES,
      0,             // offset
      numVertices,   // num vertices per instance
      numInstances,  // num instances
    );

  }

  this.update = () => {
    bindBuffer()
  }
}

export { Lines }

