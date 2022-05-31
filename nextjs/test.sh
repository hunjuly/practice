curl http://localhost:3000/api/signup -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json"

curl http://localhost:3000/api/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v
