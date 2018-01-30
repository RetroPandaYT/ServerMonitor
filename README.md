git clone https://github.com/toddlekan/ServerMonitor.git

cd ServerMonitor/client/

npm install

create file ServerMonitor/client/.env:

```API_DOMAIN=http://127.0.0.1:7555
TOKEN_COOKIE=JWToken
USER_COOKIE=Username
```

./node_modules/.bin/webpack -d

navigate web browser to: http://localhost:8080/one

Fix the code to reveal the password
