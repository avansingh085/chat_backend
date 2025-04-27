const http = require('http');
const app = require('./app');
const socketHandler = require('./socket/socketServer');
const PORT = 3001;
const server = http.createServer(app);
socketHandler(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
