const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);

//Configure socket.io
const io = new Server(server);
const chatbotConsumer = require('./chatbot.socket');
chatbotConsumer.start(io);



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//Routes
app.get('/', async (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



module.exports = server;
