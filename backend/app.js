var express = require('express');
const bodyParser = require('body-parser')
const routing = require('./src/routing');
const config=require('./globals')
const fs = require('fs');
const jwt = require("jsonwebtoken");
const http = require("http");
const app = express();
const ioServer = require('socket.io');
const RoomService=require('./src/services/room.service')

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
    }else if (req.originalUrl != "/room/create" && req.originalUrl != "/room/join" && req.originalUrl != "/room/getConnectedPlayers" && req.originalUrl != "/status") {
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

    socket.on('disconnect', () => { 
        
        let {roomID,playerNumber} = RoomService.playerDisconnected(socket.id);
        pingAll(roomID)
        switch(playerNumber){
            case 1: io.to(roomID).emit("first_player_joined",false);break;
            case 2: io.to(roomID).emit("second_player_joined",false);break;
            case 3: io.to(roomID).emit("third_player_joined",false);break;
            case 4: io.to(roomID).emit("fourth_player_joined",false);break;
        }
    });
    socket.on('create-room',(roomID)=>{
        console.log(RoomService.rooms)
        console.log("Created room, room ID:",roomID)
        RoomService.registerPlayer(socket.id,roomID,1)
        socket.join(roomID);
    })
    socket.on('join-room',(roomID,currentPlayerNumber)=>{
        console.log(RoomService.rooms)
        RoomService.registerPlayer(socket.id,roomID,currentPlayerNumber)
        socket.join(roomID);
        pingAll(roomID)
        switch(currentPlayerNumber){
            case 1: io.to(roomID).emit("first_player_joined",true);break;
            case 2: io.to(roomID).emit("second_player_joined",true);break;
            case 3: io.to(roomID).emit("third_player_joined",true);break;
            case 4: io.to(roomID).emit("fourth_player_joined",true);break;
        }
    })
    socket.on('rejoin-room',(oldSocketID,callback)=>{
        let result = RoomService.updatePlayerSocket(oldSocketID,socket.id)
        if(result){
            pingAll(result.roomID)
            callback(result.roomID,
                result.playerNumber,
                result.mapName,
                result.playersNumber,
                result.side, 
                result.serialBoard,
                result.lastPlayed)
        }else{
            callback(null,null,null,null,null)
        }
    })
    socket.on('move',(roomID,player,x,y,cb)=>{
        console.log("In room "+roomID+", Player N°"+player+" played("+x+","+y+")")
        io.to(roomID).emit('move',player,x,y)
        cb()
    })
    socket.on('send-msg',(roomID,message,player)=>{
        console.log(roomID,player,message)
        io.to(roomID).emit('receive-message',message,player)
    })
    socket.on('synchronize-board',(roomID,serialBoard,lastPlayed)=>{
        RoomService.updateBoardState(roomID,serialBoard,lastPlayed);
    })
    socket.on("ping-response",(roomID,playerNumber)=>{
        switch(playerNumber){
            case 1: console.log("first_player is alive");io.to(roomID).emit("first_player_joined",true);break;
            case 2: console.log("second_player is alive");io.to(roomID).emit("second_player_joined",true);break;
            case 3: console.log("third_player is alive");io.to(roomID).emit("third_player_joined",true);break;
            case 4: console.log("fourth_player is alive");io.to(roomID).emit("fourth_player_joined",true);break;
        }
    })
    function pingAll(roomID){
        console.log("Pinging all on room",roomID);
        io.to(roomID).emit("ping")
    }


})
server.listen(port,function(){
    console.log("server is listening on port "+port)
})
module.exports = app;
