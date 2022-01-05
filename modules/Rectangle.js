
import { Program } from './Program.js'
import { Buffer } from './Buffer.js'
import { vertexShaderSource, fragmentShaderSource } from './shaderSource.js'

function Rectangle({ gl, width, position } = {}) {
  // webgl clip space: 
  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  const clipSpaceX = -1
  const clipSpaceY = 1
  const clipSpaceSize = 2 

  const { program } = new Program(gl, vertexShaderSource, fragmentShaderSource)
  let vertices
  let vertexBuffer
  // let positionBuffer = getPositionBuffer()
  let indexBuffer = getIndexBuffer()

  init()
  
  function init() {
    vertices = getVertices()
    vertexBuffer = getVertexBuffer()
  }

  function getVertices() {
    return new Array(8).fill().map(_ => [
      position.x - width * .5, clipSpaceY, // top left
      position.x + width * .5, clipSpaceY, // top right
      position.x + width * .5, clipSpaceY - clipSpaceSize, // bottom right
      position.x - width * .5, clipSpaceY - clipSpaceSize, // bottom left
    ]).flat()
  }

  function getVertexBuffer() {
    return new Buffer({
      gl, 
      program,
      data: vertices, 
      size: 2, 
      name: 'a_vertex', 
      mode: 'TRIANGLES',
      type: 'elements'
    })
  }

  function getIndexBuffer() {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
          // |\  \‾|
          // |_\  \|
          0, 2, 3,   // first triangle
          0, 2, 1,   // second triangle
        ]),
        gl.STATIC_DRAW
    )

    return buffer
  }

  this.draw = () => {
    gl.useProgram(program)

    if(vertexBuffer && indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      vertexBuffer.draw()
    }
  }

  this.update = () => {
    init()
  }
}

export { Rectangle }
