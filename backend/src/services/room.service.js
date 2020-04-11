const Room = require('../models/room.model')
var md5 = require('md5');

let rooms = [
    new Room('abcd',null),
    new Room('abcde',null),
    new Room('abcdf',null),
]

module.exports = {
    createRoom(mapName){
        let hash = md5((new Date()).getTime().toString()+"Room");
        let room = new Room(hash,mapName);
        room.playerNumber = 1;
        rooms.push(room);
        return hash;
    },
    joinRoom(roomID){
        let room = rooms.find(room=>room.roomID == roomID) 
        if(room){
            room.playerNumber = 2;
        }
        return room;
    }
}