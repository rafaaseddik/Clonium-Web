var express = require('express');
const bodyParser = require('body-parser');
const routing = require('./src/routing');
const config = require('./globals');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const http = require("http");
const app = express();
const ioServer = require('socket.io');
const RoomService = require('./src/services/room.service');
const rateLimit = require('express-rate-limit');

app.use(bodyParser.urlencoded({ extended: true })); // for urlencoded form data
app.use(bodyParser.json()); // for json form data

// Apply rate limiter to all requests
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use("/", express.static(config.front));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-access-token, access-control-allow-origin, name, password');
    res.set('Content-type', 'application/json');
    if (req.method === "OPTIONS") {
        res.send('ok');
        res.end();
        return;
    } else if (
        req.originalUrl != "/room/create" &&
        req.originalUrl != "/room/join" &&
        req.originalUrl != "/room/getConnectedPlayers" &&
        req.originalUrl != "/status"
    ) {
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
    } else {
        next();
    }
});

app.get('/status', (req, res) => {
    res.json({
        status: 1,
        message: 'server is running'
    });
});
app.use(routing);

var port = process.env.PORT || 8080;
let server = http.createServer(app);
let io = ioServer(server);

// Helper function to shorten a room ID by cutting it in half.
function shortenRoomId(roomID) {
    return roomID.slice(0, Math.floor(roomID.length / 2));
}

/*Socket config*/
io.on('connection', (socket) => {
    console.log("socket connected");

    socket.on('disconnect', () => {
        // Assuming RoomService stores shortened room IDs.
        let { roomID, playerNumber } = RoomService.playerDisconnected(socket.id);
        // Ensure we have the shortened room id if needed.
        const shortenedRoomID = shortenRoomId(roomID);
        pingAll(shortenedRoomID);
        switch (playerNumber) {
            case 1: io.to(shortenedRoomID).emit("first_player_joined", false); break;
            case 2: io.to(shortenedRoomID).emit("second_player_joined", false); break;
            case 3: io.to(shortenedRoomID).emit("third_player_joined", false); break;
            case 4: io.to(shortenedRoomID).emit("fourth_player_joined", false); break;
        }
    });

    // When a room is created, shorten the provided roomID.
    socket.on('create-room', (roomID) => {
        const shortenedRoomID = shortenRoomId(roomID);
        console.log(RoomService.rooms);
        console.log("Created room, room ID:", shortenedRoomID);
        RoomService.registerPlayer(socket.id, shortenedRoomID, 1);
        socket.join(shortenedRoomID);
    });

    // When a user joins a room, shorten the roomID.
    socket.on('join-room', (roomID, currentPlayerNumber) => {
        const shortenedRoomID = shortenRoomId(roomID);
        console.log(RoomService.rooms);
        RoomService.registerPlayer(socket.id, shortenedRoomID, currentPlayerNumber);
        socket.join(shortenedRoomID);
        pingAll(shortenedRoomID);
        switch (currentPlayerNumber) {
            case 1: io.to(shortenedRoomID).emit("first_player_joined", true); break;
            case 2: io.to(shortenedRoomID).emit("second_player_joined", true); break;
            case 3: io.to(shortenedRoomID).emit("third_player_joined", true); break;
            case 4: io.to(shortenedRoomID).emit("fourth_player_joined", true); break;
        }
    });

    // For rejoining, assume that the roomID returned by RoomService is already in shortened format.
    socket.on('rejoin-room', (oldSocketID, callback) => {
        let result = RoomService.updatePlayerSocket(oldSocketID, socket.id);
        if (result) {
            // Shorten roomID if needed
            const shortenedRoomID = shortenRoomId(result.roomID);
            pingAll(shortenedRoomID);
            callback(
                shortenedRoomID,
                result.playerNumber,
                result.mapName,
                result.playersNumber,
                result.side,
                result.serialBoard,
                result.lastPlayed
            );
        } else {
            callback(null, null, null, null, null);
        }
    });

    socket.on('move', (roomID, player, x, y, cb) => {
        const shortenedRoomID = shortenRoomId(roomID);
        console.log("In room " + shortenedRoomID + ", Player N°" + player + " played(" + x + "," + y + ")");
        io.to(shortenedRoomID).emit('move', player, x, y);
        cb();
    });

    socket.on('send-msg', (roomID, message, player) => {
        const shortenedRoomID = shortenRoomId(roomID);
        console.log(shortenedRoomID, player, message);
        io.to(shortenedRoomID).emit('receive-message', message, player);
    });

    socket.on('synchronize-board', (roomID, serialBoard, lastPlayed) => {
        const shortenedRoomID = shortenRoomId(roomID);
        RoomService.updateBoardState(shortenedRoomID, serialBoard, lastPlayed);
    });

    socket.on("ping-response", (roomID, playerNumber) => {
        const shortenedRoomID = shortenRoomId(roomID);
        switch (playerNumber) {
            case 1:
                console.log("first_player is alive");
                io.to(shortenedRoomID).emit("first_player_joined", true);
                break;
            case 2:
                console.log("second_player is alive");
                io.to(shortenedRoomID).emit("second_player_joined", true);
                break;
            case 3:
                console.log("third_player is alive");
                io.to(shortenedRoomID).emit("third_player_joined", true);
                break;
            case 4:
                console.log("fourth_player is alive");
                io.to(shortenedRoomID).emit("fourth_player_joined", true);
                break;
        }
    });

    function pingAll(roomID) {
        console.log("Pinging all on room", roomID);
        io.to(roomID).emit("ping");
    }
});

server.listen(port, function () {
    console.log("server is listening on port " + port);
});
module.exports = app;
