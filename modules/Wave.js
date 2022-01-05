import { Lines } from './Lines.js'

function Wave({ container, speed = .0005 } = {}) {

  if(!container) {
    throw new Error('No container specified')
  }

	const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl', {
    alpha: true
  })
  const extension = gl.getExtension('ANGLE_instanced_arrays')

  if (gl === null) {
    throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.')
  }
  
  if(!extension) {
    throw new Error('No support for ANGLE_instanced_arrays')
  }

  
  let width = 30
  let height = 30
  let resizeTimeout
  const lines = new Lines({ 
    gl, 
    extension,
    size: 1,
    gap: 10,
   })
  
  container.appendChild(canvas)

  setSize(0)
  setViewport()
  let frame = requestAnimationFrame(loop)

  function loop(timeStamp) {
    if(width !== container.clientWidth || height !== container.clientHeight) {
      setSize()
    }
    setViewport()

    gl.clearColor(0, 0, 0, 0)
    gl.disable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if(lines) {
      lines.draw(timeStamp * speed)
    }

    frame = requestAnimationFrame(loop)
  }

  function setSize(delay = 500) {
    if(resizeTimeout === undefined) {
      resizeTimeout = setTimeout(() => {
        width = container.clientWidth
        height = container.clientHeight
        canvas.width = width
        canvas.height = height

        if(lines) {
          lines.update({ width })
        }

        resizeTimeout = undefined
      }, delay)
    }
  }

  function setViewport() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }
}

export { Wave }
