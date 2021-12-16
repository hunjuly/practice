function CreateSeatRow(attribute) {
    // Row_Grade_Cd
    var isFreeSeat = '08' == attribute[10]

    return isFreeSeat ? new FreeSeatRow(attribute) : new SeatRow(attribute)
}

function SeatRow(attribute) {
    this.Block_Cd = attribute[1]
    this.Row_Nbr = attribute[2]
    this.Floor_Type = attribute[3]
    this.Row_Disp_Name = attribute[4]
    this.Row_Seat_Cnt = parseInt(attribute[5])
    this.Row_Lnbr = attribute[6]
    this.Row_Rnbr = attribute[7]
    this.Row_Direct = attribute[8]
    this.Row_Seat_Status = attribute[9]
    this.Row_Grade_Cd = attribute[10]
    this.Seat_Info = attribute[11]
    this.Row_X_Coordinate = parseFloat(attribute[12]) / 3.0 / 1000.0
    this.Row_Y_Coordinate = parseFloat(attribute[13]) / 3.0 / 1000.0
    this.Row_Left_Angle = parseInt(attribute[14])
    this.Row_Right_Angle = parseInt(attribute[15])
    this.Seat_Gap = attribute[16]
    this.Coordinate2_Use_Flag = attribute[17]
    this.Mmap_X_Coordinate2 = parseFloat(attribute[18]) / 3.0 / 1000.0
    this.Mmap_Y_Coordinate2 = parseFloat(attribute[19]) / 3.0 / 1000.0

    this.GetSeat = function (id, seatIndex) {
        return new Seat(
            id,
            this.SeatNumber(seatIndex),
            this.Block_Cd,
            this.Row_Nbr,
            this.GradeCode(seatIndex),
            this.SeatInfo(seatIndex),
            this.IsFreeSeat()
        )
    }

    this.SeatNumber = function (index) {
        if (this.Row_Direct == 'R') return parseInt(this.Row_Lnbr) + index
        else return parseInt(this.Row_Lnbr) - index
    }

    this.IndexOfSeatNumber = function (seatNumber) {
        if (this.Row_Direct == 'R') return seatNumber - parseInt(this.Row_Lnbr)
        else return parseInt(this.Row_Lnbr) - seatNumber
    }

    this.SeatCount = function () {
        return parseInt(this.Row_Seat_Cnt)
    }

    this.IsFreeSeat = function () {
        return false
    }

    function GetRadian(angle) {
        return (angle * Math.PI) / 180.0
    }

    function X(x, y, rad) {
        return x * Math.cos(rad) - y * Math.sin(rad)
    }

    function Y(x, y, rad) {
        return x * Math.sin(rad) + y * Math.cos(rad)
    }

    this.FillVertices = function (squareVertices, index) {
        var rectSize = 9.0 / 1000.0
        var spaceSize = 1.0 / 1000.0
        var fullSize = 10.0 / 1000

        var radianAngle = GetRadian(360 - this.Row_Left_Angle)

        var len = rectSize / 2.0

        var x = X(len, len, radianAngle)
        var y = Y(len, len, radianAngle)

        for (var seatIdx = 0; seatIdx < this.Row_Seat_Cnt; seatIdx++) {
            // 사각형들의 중심에서 현재 사각형의 중심까지의 거리
            var lenByOrg =
                seatIdx * fullSize - (this.Row_Seat_Cnt * fullSize - spaceSize) / 2.0 + rectSize / 2.0

            // info.Row_X_Coordinate,info.Row_Y_Coordinate는 사각형들의 좌측상단 좌표다.
            // 가운데 좌표로 계산해야 한다.
            var xByOrg =
                this.Row_X_Coordinate +
                (this.Row_Seat_Cnt * fullSize - spaceSize) / 2.0 +
                X(lenByOrg, 0, radianAngle)
            var yByOrg = this.Row_Y_Coordinate + rectSize / 2.0 + Y(lenByOrg, 0, radianAngle)

            // x,y는 사각형 중심에서 우측 하단의 점이 회전했을 때의 좌표다.
            // 그러나 사각형은 정사각형이기 때문에 좌측 상단이나 우측 하단의 점이 이동하는 거리도 같다.
            // 다만 x나 y의 값이 서로 바뀌거나 -나+가 바뀌는 것 뿐이다.
            squareVertices[index++] = xByOrg - x
            squareVertices[index++] = yByOrg - y

            squareVertices[index++] = xByOrg + y
            squareVertices[index++] = yByOrg - x

            squareVertices[index++] = xByOrg + x
            squareVertices[index++] = yByOrg + y

            squareVertices[index++] = xByOrg + x
            squareVertices[index++] = yByOrg + y

            squareVertices[index++] = xByOrg - x
            squareVertices[index++] = yByOrg - y

            squareVertices[index++] = xByOrg - y
            squareVertices[index++] = yByOrg + x
        }

        return index
    }

    // this.DefaultColor = function () {
    //     var defaultColor = new SeatColor()
    //     defaultColor.red = 128
    //     defaultColor.green = 128
    //     defaultColor.blue = 128
    //     defaultColor.alpha = 255

    //     return defaultColor
    // }

    // this.GradeCode = function (index) {
    //     return this.Row_Grade_Cd.substr(index * 2, 2)
    // }

    // this.StateCode = function (index) {
    //     return this.Row_Seat_Status.substr(index * 2, 2)
    // }

    // this.UpdateStateCode = function (index, state) {
    //     var newState = this.Row_Seat_Status.slice(0, index * 2)
    //     newState += state
    //     newState += this.Row_Seat_Status.slice(index * 2 + 2)

    //     this.Row_Seat_Status = newState
    // }

    // this.SeatInfo = function (index) {
    //     return this.Seat_Info.substr(index * 2, 2)
    // }

    // this.GradeColor = function (seatIndex, gradeColorList) {
    //     var p = gradeColorList[this.GradeCode(seatIndex)]

    //     return p == undefined ? this.DefaultColor() : p
    // }

    // this.StateColor = function (seatIndex, gradeColorList, stateColorList) {
    //     if (this.StateCode(seatIndex) == '01') {
    //         // 상태가 정상이면 그냥 등급 컬러를 보여준다.
    //         return this.GradeColor(seatIndex, gradeColorList)
    //     }

    //     var p = stateColorList[this.StateCode(seatIndex)]

    //     return p == undefined ? this.DefaultColor() : p
    // }

    // this.SelectableSeatsAtIndex = function (rowIndex, seatIndex, selectCount) {
    //     if (seatIndex == -1) return []

    //     var seats = []

    //     // 9999까지는 seatrow에서 seat의 위치이다. 여기에서 SelectCount만큼 좌석상태가 01인지 에러난거 없는지 선점된거 없는지 체크해야 한다.
    //     for (var i = 0; i < selectCount; ++i) {
    //         var id = rowIndex * 10000 + seatIndex + i
    //         var seat = this.GetSeat(id, seatIndex + i)

    //         if ('01' != this.StateCode(seatIndex + i) || this.Row_Seat_Cnt <= seatIndex + i) {
    //             break
    //         }

    //         seats.push(seat)
    //     }

    //     if (seats.length == 0) {
    //         return []
    //     }
    //     //한 쪽으로 좌석 선택이 부족하다면 반대쪽으로도 검토해본다.
    //     var remainedCount = selectCount - seats.length

    //     for (var i = 1; i <= remainedCount; ++i) {
    //         var id = rowIndex * 10000 + seatIndex - i
    //         var seat = this.GetSeat(id, seatIndex - i)

    //         if ('01' != this.StateCode(seatIndex - i) || seatIndex - i < 0) {
    //             return []
    //         }

    //         seats.push(seat)
    //     }

    //     return seats
    // }

    // this.SeatIndexByPosition = function (x, y) {
    //     // 자유석 선택 부분은 예술의전당의 seatmap.m 파일을 참조해라
    //     var rectSize = 9.0 / 1000.0
    //     var fullSize = 10.0 / 1000.0

    //     if (this.Row_Left_Angle == 270 || this.Row_Right_Angle == 90) {
    //         if (
    //             x > this.Row_X_Coordinate &&
    //             x < this.Row_X_Coordinate + rectSize &&
    //             y > this.Row_Y_Coordinate &&
    //             y < this.Row_Y_Coordinate + fullSize * this.Row_Seat_Cnt
    //         ) {
    //             return Math.floor((y - this.Row_Y_Coordinate) / fullSize)
    //         }
    //     } else {
    //         // 원래는 360-this->Row_Left_Angle인데 입력된 좌표를 역회전 걸어주는 것이니까 360-를 뺸다.
    //         var radianAngle = GetRadian(this.Row_Left_Angle)

    //         // info.Row_X_Coordinate,info.Row_Y_Coordinate는 사각형들의 좌측상단 좌표다. 가운데
    //         // 좌표로 계산해야 한다.
    //         var xByOrg = this.Row_X_Coordinate + (this.Row_Seat_Cnt * fullSize) / 2.0
    //         var yByOrg = this.Row_Y_Coordinate + rectSize / 2.0

    //         var lastX = X(x - xByOrg, y - yByOrg, radianAngle)
    //         var lastY = Y(x - xByOrg, y - yByOrg, radianAngle)

    //         // x의 전체 길이의 반을 구한거다. 구한값은 원점 기준인데 인덱스나 범위 계산은 좌측 상단 기준이다.
    //         var xlimit = (this.Row_Seat_Cnt * fullSize) / 2.0

    //         if (lastX > -xlimit && lastX < xlimit) {
    //             if (lastY > -rectSize / 2.0 && lastY < rectSize / 2.0) {
    //                 return Math.floor((lastX + xlimit) / fullSize)
    //             }
    //         }
    //     }

    //     return -1
    // }

    // this.HasIndexAtPosition = function (x, y) {
    //     //자유석은 따로 해줘야 하나
    //     return this.SeatIndexByPosition(x, y) > -1
    // }
}
