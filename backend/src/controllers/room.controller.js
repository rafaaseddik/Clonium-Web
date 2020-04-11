const router = require("express").Router();
const RoomService = require('../services/room.service')
router.post('/create',(req,res)=>{
    let mapName = req.body.mapName;
    let roomID = RoomService.createRoom(mapName);
    res.json({
        status:200,
        success:true,
        roomID:roomID
    });
})

router.post('/join',(req,res)=>{
    let roomID = req.body.roomID;
    let room = RoomService.joinRoom(req.body.roomID);
    if(room){
        res.json({
            status:200,
            success:true,
            board:RoomService.joinRoom(req.body.roomID)
        });
    }else{
        res.status(404).json({
            status:404,
            success:false,
            message:'Room not found'
        })
    }
    
})

module.exports = router;