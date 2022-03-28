ab -k -n 90000 -c 10 'http://localhost:3000/v2/stress/write'
curl http://localhost:3000/v2/status
node --prof-process v8.log >processed.txt
