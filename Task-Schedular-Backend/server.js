const express= require('express');
const cors = require('cors');
const routes = require('./routes/task');
const http = require("http");
const socketIo = require("socket.io");
const cron = require('node-cron')

const app = express();

const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routes

 const server = http.createServer(app);

 const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173/", // React app's URL
      methods: ["GET", "POST","PUT","DELETE"],
    },
  });

// Store clients
let clients = [];

io.on("connection", (socket) => {
  console.log("New client connected");
 
  clients.push(socket);
 
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== socket);
  });
});
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/task',routes);




server.listen(PORT, () => console.log(`Server running on port ${PORT}`));