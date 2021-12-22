function SeatmapView() {
    let vertices = new Float32Array()
    let colors = new Float32Array()
    let seatCount = 0
    let seatmap
    let canvas
    let gl

    function WebGLHandle(canvas) {
        const gl = canvas.getContext('experimental-webgl')

        return gl ? gl : canvas.getContext('webgl')
    }

    this.Initialize = function (_seatmap, _canvas) {
        seatCount = 0
        seatmap = _seatmap
        canvas = _canvas

        for (const block of seatmap.blocks) {
            for (const row of block.rows) {
                seatCount += row.seats.length
            }
        }

        vertices = new Float32Array(seatCount * 2 * 6)
        colors = new Float32Array(seatCount * 4 * 6)

        let index = 0

        for (const block of seatmap.blocks) {
            for (const row of block.rows) {
                for (const seat of row.seats) {
                    const region = seat.region

                    vertices[index++] = region.x
                    vertices[index++] = region.y

                    vertices[index++] = region.x + region.height
                    vertices[index++] = region.y

                    vertices[index++] = region.x + region.width
                    vertices[index++] = region.y + region.height

                    vertices[index++] = region.x + region.width
                    vertices[index++] = region.y + region.height

                    vertices[index++] = region.x
                    vertices[index++] = region.y

                    vertices[index++] = region.x
                    vertices[index++] = region.y + region.width
                }
            }
        }

        gl = WebGLHandle(canvas)

        vertexRenderer = new VertexRenderer()
        vertexRenderer.Initialize(gl, vertices)
    }

    this.Draw = function (statuses) {
        let index = 0

        for (var count = 0; count < seatCount; ++count) {
            // 꼭지점3개로 삼각형*2개=사각형
            for (var i = 0; i < 6; ++i) {
                colors[index++] = 1.0 // red
                colors[index++] = 0.5 // green
                colors[index++] = 0.5 // blue
                colors[index++] = 1.0 // alpha
            }
        }

        gl.viewport(0, 0, canvas.width, canvas.height)
        vertexRenderer.Draw(seatmap.width, seatmap.height, colors)
    }
}
