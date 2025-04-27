const http = require('http');
const app = require('./app');
const socketHandler = require('./socket/socketServer');
const PORT = 3001;
app.use(cors({ origin: "*"}));
const options = {
    key: fs.readFileSync("server-key.pem"),
    cert: fs.readFileSync("server-cert.pem"),
};
const server = http.createServer(options,app);
const io = new Server(server, {
    cors: { origin: "*" },
});
socketHandler(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
