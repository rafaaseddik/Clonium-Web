var express = require('express');
const bodyParser = require('body-parser')
const routing = require('./src/routing');
const config=require('./globals')
const fs = require('fs');
const jwt = require("jsonwebtoken");
const http = require("http");
const app = express();
const ioServer = require('socket.io');

app.use(bodyParser.urlencoded({extended: true})); // for urlencoded formdate
app.use(bodyParser.json());// for json form


app.use("/", express.static(config.front));
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-access-token, access-control-allow-origin, name, password');
    res.set('Content-type', 'application/json');
    if (req.method === "OPTIONS") {
        res.send('ok');
        res.end();
        return;
    }else if (req.originalUrl != "/room/create" && req.originalUrl != "/room/join"&& req.originalUrl != "/status") {
        const token = req.headers["x-access-token"];
        if (token) {
            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        "status": 401,
                        "success": false,
                        "message": "Failed to authenticate token."
                    });
                    return;
                }
                req.decoded = decoded;
                next();
            });
        } else {
            res.status(403).json({
                "status": 403,
                "success": false,
                "message": "No token provided."
            });
            return;
        }
    }else {
        next();
    }
});

app.get('/status',(req,res)=>{
    res.json({
        status:1,
        message:'server is running'
    })
})
app.use(routing);

var port = process.env.PORT || 8080;

let server = http.createServer(app);
let io = ioServer(server);   

/*Socket confi*/    

io.on('connection',(socket)=>{
    console.log("socket connected")
    socket.on('create-room',(roomID)=>{
        console.log("Created room, room ID:",roomID)
        socket.join(roomID);
    })
    socket.on('join-room',(roomID)=>{
        console.log("Joined room, room ID:",roomID)
        socket.join(roomID);
        io.to(roomID).emit("second_player_joined");
    })
    socket.on('move',(roomID,player,x,y)=>{
        console.log("In room "+roomID+", Player N°"+player+" played("+x+","+y+")")
        io.to(roomID).emit('move',player,x,y)
    })

})
server.listen(port,function(){
    console.log("server is listening on port "+port)
})
module.exports = app;
