const http = require('http');
const app = require('./app');
const cors=require('cors');
const fs=require('fs');
const socketHandler = require('./socket/socketServer');
const PORT = 3001;
const options = {
    key: fs.readFileSync("server-key.pem"),
    cert: fs.readFileSync("server-cert.pem"),
};
const server = http.createServer(options,app);
socketHandler(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
