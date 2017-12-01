// TranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_xformMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n'+
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// The translation distance for x, y, and z direction
var Tx = 0.0 , Ty = 0.0, Tz = 0.0;
var Sx = 1.0 , Sy = 1.0, Sz = 1.0;
var rgba = [1.0, 1.0, 1.0, 1.0];
var angle = 0;
var flag = 0;
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
    
   
    
    // Pass the translation distance to the vertex shader
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    
    
    function run() {
        
        var radian = Math.PI * angle / 180.0;
        var cosB = Math.cos(radian),sinB = Math.sin(radian);
        
        var xformMatrix = new Float32Array([
            Sx*cosB,sinB,0.0,0.0,
            -sinB,Sy*cosB,0.0,0.0,
            0.0,0.0,Sz,0.0,
            Tx,Ty,Tz,1.0
        ]);
        gl.uniform4fv(u_FragColor, rgba);
        gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix);
        // Specify the color for clearing <canvas>
        gl.clearColor(0, 0, 0, 1);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
    run();
    
    //颜色
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
        run();
    };
    //平移,旋转
    window.onkeydown = function (event) {
        var key = event.keyCode
        if(key == 37)
        {
            Tx = Tx - 0.1; Ty = Ty + 0.0 ; Tz = Tz + 0.0;
        }
        if(key == 38)
        {
            Tx = Tx + 0.0; Ty = Ty + 0.1 ; Tz = Tz + 0.0;
        }
        if(key == 39)
        {
            Tx = Tx + 0.1; Ty = Ty + 0.0 ; Tz = Tz + 0.0;
        }
        if(key == 40)
        {
            Tx = Tx + 0.0; Ty = Ty - 0.1 ; Tz = Tz + 0.0;
        }
        // gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
        var key = String.fromCharCode(event.keyCode);
        switch(key){
            case 'A':
            case 'a': angle += 1; break;
            case 'D':
            case 'd': angle -= 1; break;    
        }
        run();
        // draw(gl , n);
    }
    //缩放
    document.getElementById('slider').onchange = function () {
        size = event.srcElement.value;
        Sx = size / 50;
        Sy = size / 50;
        Sz = size / 50;
        run();
    };
    
    var tick = function() {
        if(flag == 0 ) angle++;
        else angle--;
        run();
        requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick
    };
    tick();
    


}
function initVertexBuffers(gl) {

    var n = 3; // The number of vertices
    var vertices = new Float32Array([
        0 , 0.5 ,   -0.5, -0.5,   0.5, -0.5
    ]);
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

    // Assign the buffer object to the attribute variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
function up() {
    flag = 1;
}

function down() {
    flag = 0;
}

