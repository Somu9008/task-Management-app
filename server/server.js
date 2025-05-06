require("dotenv").config();
const cors = require("cors");
const app = require("./app");
const http = require("http");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});

app.set("io", io);

const connectDB = require("./config/db");

const PORT = process.env.PORT || 9000;

connectDB();

server.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
