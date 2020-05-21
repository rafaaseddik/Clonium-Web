class Room{

    constructor(roomID,board,playersNumber,side){
        this.roomID = roomID;
        this.board = board;
        this.playersNumber = playersNumber;
        this.onlinePlayers=1;
        this.side = side;
        this.playerSession = {

        },
        this.serialBoard = "";
        this.lastPlayed=0;
    }
}
module.exports = Room;