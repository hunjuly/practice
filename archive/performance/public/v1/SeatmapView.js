function SeatmapView() {
    let vertices = new Float32Array()
    let colors = new Float32Array()
    let seatCount = 0
    let seatmap
    let canvas
    let gl

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

        gl = canvas.getContext('webgl')

        vertexRenderer = new VertexRenderer()
        vertexRenderer.Initialize(gl, vertices)
    }

    this.Draw = function (statuses) {
        let index = 0

        for (const item of statuses) {
            let color = { r: 0.5, g: 0.5, b: 0.5 }

            if (item.status === 'hold') {
                color = { r: 0.25, g: 1.0, b: 0.25 }
            } else if (item.status === 'sold') {
                color = { r: 1.0, g: 0.25, b: 0.25 }
            }

            // 꼭지점3개로 삼각형*2개=사각형
            for (var i = 0; i < 6; ++i) {
                colors[index++] = color.r
                colors[index++] = color.g
                colors[index++] = color.b
                colors[index++] = 1.0 // alpha
            }
        }

        gl.viewport(0, 0, canvas.width, canvas.height)
        vertexRenderer.Draw(seatmap.width, seatmap.height, colors)
    }
}

async function createSeatmapView() {
    const res = await fetch('/v1/seatmap')
    const seatmap = await res.json()

    const canvas = document.getElementById('glcanvas')

    const seatmapView = new SeatmapView()
    seatmapView.Initialize(seatmap, canvas)

    const reload = async () => {
        const res = await fetch('/v1/status')
        const statuses = await res.json()

        seatmapView.Draw(statuses)

        setTimeout(reload, 1000)
    }

    reload()
}
