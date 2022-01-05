function InstancedMesh({ 
  gl, 
  instanceExtension, 
  type = 'ARRAY_BUFFER', 
  buffer,
  program,
  name, // 'a_name'
  size, // size of one vector || number of components per attribute,
  geometry,
  attributes = [],
} = {}) {

  const location = gl.getAttribLocation(program, name)

  gl.bindBuffer(gl[type], buffer)
  gl.enableVertexAttribArray(location)
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 12, 0)

  if(instanceExtension) {
    instanceExtension.vertexAttribDivisorANGLE(shader.attribute.offset, 1)
  }
  
}

export { InstancedMesh }
