const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const logRoutes = require('./routes/log.js');
const connection = require('./DB/config.js');
const http = require('http');
const { Server } = require('socket.io');
const path = require("path");

dotenv.config();
connection();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use('/logs', (req, res, next) => {
  req.io = io;
  next();
}, logRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT);
