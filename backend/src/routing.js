var router = require('express').Router()

const roomController    = require("./controllers/room.controller");
const gameController    = require("./controllers/game.controller");

router.use('/room',roomController);
router.use('/game', gameController);


module.exports = router;
