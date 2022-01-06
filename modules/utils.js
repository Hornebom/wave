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
 * @param {number} number
 * @param {number} min 
 * @param {number} max 
 * @returns {Number}
 */
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

export { hex2rgba, clamp }