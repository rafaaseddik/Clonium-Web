const Room = require('../models/room.model')
var md5 = require('md5');

let rooms = [

]

module.exports = {
    createRoom(mapName,playersNumber,side){
        let hash = md5((new Date()).getTime().toString()+"Room");
        let room = new Room(hash,mapName,playersNumber,side);
        room.onlinePlayers = 1;
        rooms.push(room);
        return hash;
    },
    joinRoom(roomID){
        let room = rooms.find(room=>room.roomID == roomID) 
        let currentPlayerNumber=1;
        if(room && room.onlinePlayers<room.playersNumber){
            console.log("adding player")
            currentPlayerNumber = room.onlinePlayers + 1;
            room.onlinePlayers += 1;
        }else{
            return undefined;
        }
        return {room,currentPlayerNumber};
    },
    getConnectedPlayers(roomID){
        let room = rooms.find(room=>room.roomID == roomID) 
        if(room){
            return room.onlinePlayers
        }else{
            return undefined;
        }
    }
}