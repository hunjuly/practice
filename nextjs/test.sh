curl http://localhost:3000/api/signup -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json"

curl http://localhost:3000/api/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json"

curl http://localhost:4000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v
Set-Cookie: connect.sid=s%3AQu2pnp84rzMhMik5w1w8ijslwStFT1Ow0
Path=/
HttpOnly
