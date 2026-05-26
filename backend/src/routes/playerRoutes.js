const express = require("express");
const userMiddleware = require('../middleware/userMiddleware.js')

const {
  createPlayer,
  readPlayer,
  updatePlayer,
  deletePlayer,
  readAllPlayers,
} = require("../controllers/playerController.js");
const router = express.Router();
router.route("/tournaments/:tournamentId/players").post(userMiddleware, createPlayer);
router.route("/tournaments/:tournamentId/players").get(readAllPlayers);
router.route("/tournament-players/:idPlayer").get(readPlayer);
router.route("/tournament-players/:idPlayer").patch(userMiddleware, updatePlayer);
router
  .route("/tournaments/:tournamentId/players/:playerId")
  .delete(deletePlayer);

module.exports = router;
