/**
 * @param {ArrayBuffer} buffer 
 */
const buf2hex = buffer => Array.prototype.map.call(new Uint8Array(buffer), x => (`00${x.toString(16)}`).slice(-2)).join('');

export default buf2hex;
