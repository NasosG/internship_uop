const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");
require('dotenv').config();

const normalizePort = val => {
  let port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) return val;
  // port number
  if (port >= 0) return port;

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const hostname = process.env.HOST || "localhost";
// use port 3000 unless there exists a preconfigured port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));
