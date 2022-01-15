function SeatmapView() {
    let vertices = new Float32Array()
    let colors = new Float32Array()
    let seatCount = 0
    let colorsSize = 0
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

        colorsSize = seatCount * 4 * 6

        vertices = new Float32Array(seatCount * 2 * 6)
        colors = new Float32Array(colorsSize)

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

    this.Draw = function (holds, solds) {
        // available
        for (let i = 0; i < colorsSize; i += 4) {
            colors[i + 0] = 0.5
            colors[i + 1] = 0.5
            colors[i + 2] = 0.5
            colors[i + 3] = 1.0 // alpha
        }

        this.decompress(holds, { r: 0.25, g: 1.0, b: 0.25 })
        this.decompress(solds, { r: 1.0, g: 0.25, b: 0.25 })

        gl.viewport(0, 0, canvas.width, canvas.height)
        vertexRenderer.Draw(seatmap.width, seatmap.height, colors)
    }

    function isOn(statuses, statusesIdx) {
        switch (statusesIdx) {
            case 0:
                return statuses & 0x80
            case 1:
                return statuses & 0x40
            case 2:
                return statuses & 0x20
            case 3:
                return statuses & 0x10
            case 4:
                return statuses & 0x08
            case 5:
                return statuses & 0x04
            case 6:
                return statuses & 0x02
            case 7:
                return statuses & 0x01
            default:
                console.log('overflow ' + statusesIdx)
                break
        }
    }

    this.decompress = function (array, color) {
        let index = 0

        for (let i = 0; i < seatCount; i++) {
            const arrayIdx = i / 8
            const seatStatuses = array[arrayIdx]

            const statusesIdx = i % 8

            if (isOn(seatStatuses, statusesIdx)) {
                for (let x = 0; x < 6; ++x) {
                    colors[index++] = color.r
                    colors[index++] = color.g
                    colors[index++] = color.b
                    colors[index++] = 1.0 // alpha
                }
            } else {
                index += 24
            }
        }
    }
}

async function createSeatmapView() {
    const res = await fetch('/v2/seatmap')
    const seatmap = await res.json()

    const canvas = document.getElementById('glcanvas')

    const seatmapView = new SeatmapView()
    seatmapView.Initialize(seatmap, canvas)

    const reload = async () => {
        const res = await fetch('/v2/status')
        const base64Statuses = await res.json()

        const holds = Uint8Array.from(atob(base64Statuses.holds), (c) => c.charCodeAt(0))
        const solds = Uint8Array.from(atob(base64Statuses.solds), (c) => c.charCodeAt(0))

        seatmapView.Draw(holds, solds)

        setTimeout(reload, 1000)
    }

    reload()
}
