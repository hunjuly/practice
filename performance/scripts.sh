ab -k -n 90000 -c 10 "http://localhost:3000/stress/write"
ab -k -n 100 -c 10 "http://localhost:3000/status"
ab -k -n 10 -c 1 "http://localhost:3000/status"

node --prof-process v8.log > processed.txt
