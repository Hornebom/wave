
import { Program } from './Program.js'
import { Buffer } from './Buffer.js'
import { vertexShaderSource, fragmentShaderSource } from './shaderSource.js'

function Lines({ gl, gap = 20 } = {}) {
  // webgl clip space: 
  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  const clipSpaceX = -1
  const clipSpaceY = 1
  const clipSpaceSize = 2 

  const { program } = new Program(gl, vertexShaderSource, fragmentShaderSource)
  
  let count = getCount()
  let vertices = getVertices()
  let buffer

  function getVertices() {
    const newVertices = []
    const normalizedGap = clipSpaceSize / count
    let x = clipSpaceX
    
    for(let i = 0; i < count; i++) {
      newVertices.push(
        x, clipSpaceY,
        x, clipSpaceY - clipSpaceSize
      )

      x += normalizedGap
    }
    
    return newVertices
  }

  function getCount() {
    return Math.floor(gl.canvas.clientWidth / gap)
  }

  function getBuffer() {
    return new Buffer({
      gl, 
      program,
      data: vertices, 
      size: 2, 
      name: 'a_vertex', 
      mode: 'LINES' 
    })
  }

  this.render = () => {
    gl.useProgram(program)

    if(buffer) {
      buffer.draw()
    }
  }

  this.update = () => {
    count = getCount()
    vertices = getVertices()
    buffer = getBuffer()
  }
}

export { Lines }
