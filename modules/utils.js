/**
 * @param {string} hex - 6 character hex value (optional #)
 * @param {number} alpha - decimal float 0-1
 * @returns {Array}
 */
 function hex2rgba(hex, alpha = 1) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255)
  return [r, g, b, alpha]
}

 /**
 * Makes a translation matrix
 * source: https://webglfundamentals.org/webgl/resources/m4.js
 * @param {number} tx x translation.
 * @param {number} ty y translation.
 * @param {number} tz z translation.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
function translation(tx, ty, tz, dst) {
  dst = dst || new MatType(16)

  dst[ 0] = 1
  dst[ 1] = 0
  dst[ 2] = 0
  dst[ 3] = 0
  dst[ 4] = 0
  dst[ 5] = 1
  dst[ 6] = 0
  dst[ 7] = 0
  dst[ 8] = 0
  dst[ 9] = 0
  dst[10] = 1
  dst[11] = 0
  dst[12] = tx
  dst[13] = ty
  dst[14] = tz
  dst[15] = 1

  return dst
}

export { hex2rgba, translation }