/**
 * the OpenGL context
 * @type {WebGLRenderingContext}
 */
var gl = null;

/**
 * shader program
 * @type {WebGLProgram}
 */
var shaderProgram = null;

var arrayBuffer = null;

/**
 * initializes OpenGL context, compile shader, and load buffers
 */
function init(resources) {
  //create a GL context
  gl = createContext(400 /*width*/, 400 /*height*/);

  //in WebGL/OpenGL3 we have to create and use our own shaders for the programmable pipeline
  //create the shader program
  shaderProgram = createProgram(gl, resources.vs, resources.fs);

  //create a buffer
  arrayBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);

  //define the array 
  const points = new Float32Array([
    -1.0, -1.0, 
    1.0, -1.0, 
    -1.0, 1.0,
    -1.0, 1.0, 
    1.0, -1.0,
    1.0, 1.0 ]);
  
  //this copies data to the gpu
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  //same for the color
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  const colors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 1, 0, 1,
    0, 0, 0, 1]);
  
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
}

/**
 * render one frame
 */
function render() {
  //specify the clear color
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  //clear the existing frame buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  //activate shader program
  gl.useProgram(shaderProgram);

  //we use a uniform to specify the rectangle color
  //a uniform is like a parameter to a shader (vertex or fragment).
  //however, the same value is used for all instances
  var userColor = { r: 0.6, g: 0.2, b: 0.8};
  gl.uniform3f(gl.getUniformLocation(shaderProgram, 'u_usercolor'),
  userColor.r, userColor.g, userColor.b);


  //we look up the internal location after compilation of the shader program given the name of the attribute
  const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');

  //enable this vertex attribute
  gl.enableVertexAttribArray(positionLocation);
  //use the currently bound buffer for this location
  //each element is a FLOAT with 2 components
  //2 .. number of components
  //float ... type
  //false ... the array should not be normalized
  //stride / offset ... in case you are interleaving different attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(shaderProgram, 'a_color');
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

  //request another call as soon as possible
  //requestAnimationFrame(render);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

//load predefined shaders
loadResources({
  //list of all resources that should be loaded as key: path
  vs: 'shader/simple.vs.glsl',
  fs: 'shader/simple.fs.glsl'
}).then(function (resources) {
  init(resources);
  //render one frame
  render();
});
