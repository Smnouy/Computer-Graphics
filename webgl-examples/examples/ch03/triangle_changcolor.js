// HelloTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n'+
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    /*------------------------------------------------------------------------*/
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    var rgba = [1.0, 1.0, 1.0, 1.0];

    canvas.onmousedown = function(ev){
        if(ev.button == 0)
            rgba = [1.0, 0.0, 0.0, 1.0];//红
        else if(ev.button == 1)
            rgba = [0.0, 1.0, 0.0 ,1.0];//绿
        else
            rgba = [0.0, 0.0, 1.0, 1.0];//蓝

        draw(gl, u_FragColor, rgba,n);
    };

    var m=document.getElementById("menu");
    m.onchange = function(){
        switch(m.selectedIndex){
            case 1:
                rgba = [1.0, 0.0, 0.0, 1.0];break;
            case 2:
                rgba = [0.0, 1.0, 0.0 ,1.0];break;
            case 3:
                rgba = [0.0, 0.0, 1.0, 1.0];break;
        }
        draw(gl, u_FragColor, rgba, n);
    };

    window.onkeydown = function (event) {
        var key = String.fromCharCode(event.keyCode); //将键盘接收的Unicode(ASCII)码转为字符串
        switch (key){
            case 'r':
            case 'R':rgba = [1.0, 0.0, 0.0, 1.0];break;
            case 'g':
            case 'G':rgba = [0.0, 1.0, 0.0 ,1.0];break;
            case 'b':
            case 'B':rgba = [0.0, 0.0, 1.0, 1.0];break;
        }
        draw(gl, u_FragColor, rgba, n);
    };
    /*------------------------------------------------------------------------*/
    
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    //gl.drawArrays(gl.TRIANGLES, 0, n);
    //Draw the triangle
    draw(gl, u_FragColor, rgba, n);
    
}

function draw(gl, u_FragColor, rgba, n) {
    gl.uniform4fv(u_FragColor, rgba);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
