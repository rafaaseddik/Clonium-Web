class SocketPlayer{

    constructor(id,roomID,playerNumber){
        this.id = id;
        this.roomID = roomID;
        this.playerNumber = playerNumber;
        this.online = true;
    }
}
module.exports = SocketPlayer;