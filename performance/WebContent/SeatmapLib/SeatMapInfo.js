function SeatMapInfo() {
    var totalSeatCount = 0

    var squareVertices = new Float32Array() // GLfloat
    var gradeColors = new Float32Array() // GLubyte

    var mapSizeWidth = 0
    var mapSizeHeight = 0

    this.Initialize = function (seatMapData, backgroundImageWidth, backgroundImageHeight) {
        mapSizeWidth = backgroundImageWidth / 1000.0
        mapSizeHeight = backgroundImageHeight / 1000.0

        holdedSeats = []

        MakeSeatList(seatMapData)
        gradeColorInfoList = MakeColorList()

        totalSeatCount = 0

        for (info in seatRowList) {
            var seat = seatRowList[info]

            totalSeatCount += seat.SeatCount()
        }

        squareVertices = new Float32Array(totalSeatCount * 2 * 6) // GLfloat
        gradeColors = new Float32Array(totalSeatCount * 4 * 6) // GLfloat

        var squareVerticesIdx = 0
        var colorsIdx = 0

        for (index in seatRowList) {
            var info = seatRowList[index]

            squareVerticesIdx = info.FillVertices(squareVertices, squareVerticesIdx)

            // color는 draw 할 때 채워라. 상태가 바뀌면 채워야 한다
            for (var seatIdx = 0; seatIdx < info.SeatCount(); seatIdx++) {
                const status = 'hold'
                const color = gradeColorInfoList(status)
                FillColor(color, gradeColors, colorsIdx)
                colorsIdx += 6 * 4
            }
        }
    }

    function MakeSeatList(data) {
        var list = data.split('\n')

        for (var item in list) {
            var attribute = list[item].split('|')

            if (attribute.length != 21) break

            seatRowList.push(CreateSeatRow(attribute))
        }
    }

    function MakeColorList() {
        var colorInfoList = []

        var info = new SeatColor()
        info.red = 1
        info.green = 1
        info.blue = 1
        info.alpha = 1
        colorInfoList['available'] = info

        var info2 = new SeatColor()
        info2.red = 0
        info2.green = 1
        info2.blue = 0
        info2.alpha = 1
        colorInfoList['hold'] = info2

        var info3 = new SeatColor()
        info3.red = 1
        info3.green = 0
        info3.blue = 0
        info3.alpha = 1
        colorInfoList['sold'] = info3

        return colorInfoList
    }

    function FillColor(seatColor, buffer, index) {
        // 꼭지점3개로 삼각형*2개=사각형
        for (var i = 0; i < 6; ++i) {
            buffer[index++] = seatColor.red
            buffer[index++] = seatColor.green
            buffer[index++] = seatColor.blue
            buffer[index++] = seatColor.alpha
        }
    }

    this.TotalSeatCount = function () {
        return totalSeatCount
    }

    this.Vertices = function () {
        return squareVertices
    }

    this.Colors = function () {
        return gradeColors
    }

    this.MapWidth = function () {
        return mapSizeWidth
    }

    this.MapHeight = function () {
        return mapSizeHeight
    }
}
