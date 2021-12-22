ab -k -n 150 -c 10 "http://localhost:3000/tests/readWriteStatus"
ab -k -n 15 -c 1 "http://localhost:3000/seatmaps/seatmapId-1/status"
