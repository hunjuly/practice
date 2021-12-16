function SeatMapView() {
    this.Initialize = function (seatmapInfo, canvas) {
        const gl = WebGLHandle(canvas)

        vertexRenderer = new VertexRenderer()
        vertexRenderer.Initialize(gl, seatmapInfo.Vertices())
    }

    function WebGLHandle(canvas) {
        var gl = null

        try {
            gl = canvas.getContext('experimental-webgl')

            if (gl == null) {
                gl = canvas.getContext('webgl')
            }
        } catch (error) {}

        if (gl == null) {
            alert('Unable to initialize WebGL. Your browser may not support it.')
        }

        return gl
    }

    function Draw(statuses) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        vertexRenderer.Draw(seatmapInfo.MapWidth(), seatmapInfo.MapHeight(), seatmapInfo.Colors())
    }
}
