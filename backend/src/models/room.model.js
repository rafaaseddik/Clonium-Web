class Room{

    constructor(roomID,board,playersNumber){
        this.roomID = roomID;
        this.board = board;
        this.playersNumber = playersNumber;
        this.onlinePlayers=1;
    }
}
module.exports = Room;