const Room = require('../models/room.model')
const SocketPlayer = require('../models/player.model')
var md5 = require('md5');

let rooms = [

];

let playersNumber = [

];



module.exports = {
    createRoom(mapName, playersNumber, side) {
        let hash = md5((new Date()).getTime().toString() + "Room");
        let room = new Room(hash, mapName, playersNumber, side);
        room.onlinePlayers = 1;
        rooms.push(room);
        return hash;
    },
    joinRoom(roomID) {
        let room = rooms.find(room => room.roomID == roomID)
        let currentPlayerNumber = 1;
        if (room && room.onlinePlayers < room.playersNumber) {
            console.log("adding player")
            currentPlayerNumber = room.onlinePlayers + 1;
            room.onlinePlayers += 1;
        } else {
            return undefined;
        }
        return {
            room,
            currentPlayerNumber
        };
    },
    getConnectedPlayers(roomID) {
        let room = rooms.find(room => room.roomID == roomID)
        if (room) {
            return room.onlinePlayers
        } else {
            return undefined;
        }
    },
    registerPlayer(socketID, roomID, playerNumber) {
        let room = rooms.find(room => room.roomID == roomID)
        if (room) {
            console.log(`Registering player N°${playerNumber} to room ${roomID}`);
            let player = new SocketPlayer(socketID, roomID, playerNumber);
            room.playerSession[socketID] = player;
            return true;
        } else {
            return false;
        }
    },
    playerDisconnected(socketID) {
        let room = rooms.find(room => {
            if (socketID in room.playerSession) {
                return room;
            }
        })
        if (room) {
            console.log(`Unegistering player N°${room.playerSession[socketID].playerNumber} from room ${room.roomID}`)
            result = {
                roomID: room.roomID,
                playerNumber: room.playerSession[socketID].playerNumber
            };
            console.log(result)
            room.playerSession[socketID].online = false;
            return result;
        } else {
            console.error(`Couldn't find room for socket ${socketID}`)
            return false;
        }
    },
    updatePlayerSocket(oldSocketID, newSocketID) {
        let room = rooms.find(room => {
            if (oldSocketID in room.playerSession && !room.playerSession[oldSocketID].online) {
                return room;
            }
        });

        if (room) {
            let player = room.playerSession[oldSocketID]
            room.playerSession[newSocketID] = Object.assign({}, player)
            room.playerSession[newSocketID].socketID = newSocketID;
            delete room.playerSession[oldSocketID];
            return {
                roomID: room.roomID,
                playerNumber: player.playerNumber,
                mapName: room.board,
                playersNumber:room.playersNumber,
                side:room.side,
                serialBoard:room.serialBoard,
                lastPlayed:room.lastPlayed
            };
        } else {
            return false;
        }
    },updateBoardState(roomID,serialBoard,lastPlayed){
        let room = rooms.find(room => room.roomID == roomID)
        if (room) {
            room.serialBoard = serialBoard;
            room.lastPlayed = lastPlayed;
        }
    },rooms
}