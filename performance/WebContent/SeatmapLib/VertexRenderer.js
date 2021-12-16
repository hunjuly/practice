function VertexRenderer() {
    var gl
    var mvMatrix
    var perspectiveMatrix

    var squareVerticesBuffer
    var squareVerticesColorBuffer
    var shader
    var vertex_vertexPositionAttribute
    var vertex_vertexColorAttribute

    var vertices

    this.Initialize = function (glcontext, aVertices) {
        gl = glcontext
        vertices = aVertices

        initShaders()
        initBuffers()
    }

    function initBuffers() {
        squareVerticesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

        squareVerticesColorBuffer = gl.createBuffer()
    }

    this.Draw = function (xEnd, yBegin, colors) {
        gl.useProgram(shader)

        perspectiveMatrix = makeOrtho(0, xEnd, yBegin, 0, 1.0, -1.0)

        loadIdentity()

        mvTranslate([0.0, 0.0, 0.0])

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
        gl.vertexAttribPointer(vertex_vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
        gl.vertexAttribPointer(vertex_vertexColorAttribute, 4, gl.FLOAT, false, 0, 0)

        setMatrixUniforms(shader)
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 3)
    }

    function FragmentShaderSource() {
        return 'varying lowp vec4 vColor;\
		void main(void)\
		{\
		gl_FragColor = vColor;\
		}\
		'
    }

    function VertexShaderSource() {
        return 'attribute vec2 aVertexPosition;\
		attribute vec4 aVertexColor;\
		\
		uniform mat4 uMVMatrix;\
		uniform mat4 uPMatrix;\
		\
		varying lowp vec4 vColor;\
		\
		void main(void)\
		{\
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);\
			vColor = aVertexColor;\
		}\
		'
    }

    function initShaders() {
        shader = gl.createProgram()
        gl.attachShader(shader, getVertexShader(gl, VertexShaderSource()))
        gl.attachShader(shader, getFragmentShader(gl, FragmentShaderSource()))
        gl.linkProgram(shader)

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program.')
        }

        gl.useProgram(shader)

        vertex_vertexPositionAttribute = gl.getAttribLocation(shader, 'aVertexPosition')
        gl.enableVertexAttribArray(vertex_vertexPositionAttribute)

        vertex_vertexColorAttribute = gl.getAttribLocation(shader, 'aVertexColor')
        gl.enableVertexAttribArray(vertex_vertexColorAttribute)
    }

    //
    // Matrix utility functions
    //
    function loadIdentity() {
        mvMatrix = Matrix.I(4)
    }

    function multMatrix(m) {
        mvMatrix = mvMatrix.x(m)
    }

    function mvTranslate(v) {
        multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4())
    }

    function setMatrixUniforms(shader) {
        var pUniform = gl.getUniformLocation(shader, 'uPMatrix')
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()))

        var mvUniform = gl.getUniformLocation(shader, 'uMVMatrix')
        gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()))
    }
}
