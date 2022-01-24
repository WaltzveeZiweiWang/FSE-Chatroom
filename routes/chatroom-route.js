const express = require("express");
const router = express.Router();
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Chatroom
router.get("/chatroom", (req, res) => {
    console.log(req.user);
    res.render("chatroom.ejs",{user:req.user});
  });
  
  
io.on('connection', (socket) => {
    socket.on('chat message', msg => {
    io.emit('chat message', msg);
    });
  });

module.exports = app;