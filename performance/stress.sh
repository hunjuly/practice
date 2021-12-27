ab -k -n 90000 -c 10 "http://localhost:5300/stress/write"
ab -k -n 90 -c 10 "http://localhost:5300/status"
