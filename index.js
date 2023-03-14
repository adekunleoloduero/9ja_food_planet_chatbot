const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);

//Configure socket.io
const io = new Server(server);
const chatbotConsumer = require('./chatbot.socket');
chatbotConsumer.start(io);



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Views
app.set("view engine", "ejs");
app.set("views", "views");



//Routes
app.get('/', async (req, res, next) => {
    res.render('index');
});




module.exports = server;
