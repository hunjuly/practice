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
        const defaultColor = { r: 0.5, g: 0.5, b: 0.5 }

        for (let i = 0; i < seatCount; i++) {
            fillColor(colors, i, defaultColor)
        }

        this.decompress(holds, { r: 0.25, g: 1.0, b: 0.25 })
        this.decompress(solds, { r: 1.0, g: 0.25, b: 0.25 })

        gl.viewport(0, 0, canvas.width, canvas.height)
        vertexRenderer.Draw(seatmap.width, seatmap.height, colors)
    }

    this.decompress = function (array, color) {
        for (let i = 0; i < seatCount; i++) {
            const arrayIdx = Math.floor(i / 8)
            const seatStatuses = array[arrayIdx]
            const statusesIdx = i % 8

            if (isOn(seatStatuses, statusesIdx)) {
                fillColor(colors, i, color)
            }
        }
    }

    function fillColor(buffer, index, color) {
        const colorIdx = index * 6 * 4

        for (let x = 0; x < 6; x += 4) {
            const pointIdx = colorIdx + x * 4

            buffer[pointIdx + 0] = color.r
            buffer[pointIdx + 1] = color.g
            buffer[pointIdx + 2] = color.b
            buffer[pointIdx + 3] = 1.0 // alpha
        }
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
                console.error('overflow ' + statusesIdx)
                break
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

        const holdBuffer = atob(base64Statuses.holds)
        const holds = Uint8Array.from(holdBuffer, (c) => c.charCodeAt(0))

        const soldBuffer = atob(base64Statuses.solds)
        const solds = Uint8Array.from(soldBuffer, (c) => c.charCodeAt(0))

        seatmapView.Draw(holds, solds)

        setTimeout(reload, 1000)
    }

    reload()
}
