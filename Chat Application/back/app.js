require('./api/config/passportConfig');
var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const passport = require('passport');
const http = require('http');
const socketIO = require('socket.io');

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, authorization");
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('preflightContinue', false);
//   next();
// }) 
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 
app.use(bodyParser.json({limit: '50mb'}));
const uri = 'mongodb://localhost/chatapp';
const server = http.Server(app);

mongoose.connect(uri);
const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chat');

app.use(bodyParser.json());
app.use(passport.initialize());
//route
app.use("/users", userRoutes);
app.use("/chat",chatRoutes);

//server start
server.listen(3000,() => {
        console.log('app listening on port ',3000);
});

const io = socketIO(server);

// socket io
io.on('connection', function (socket) {
        console.log('User connected');
        socket.on('disconnect', function() {
          console.log('User disconnected');
        });
        socket.on('save-like', function(){
          io.emit('save-like');
        })
        socket.on('new-img', function (data) {
          io.emit('new-img' , data)
          console.log(data);        
     });
        socket.on('save-message', function (data) {
          io.emit('new-message', { message: data });
     });
 });
      