const express = require("express");

const {
  createPlayer,
  readPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerController.js");
const router = express.Router();
router.route("/tournaments/:tournamentId/players").post(createPlayer);
router.route("/tournament-players/:idPlayer").get(readPlayer);
router.route("/tournament-players/:idPlayer").patch(updatePlayer);
router
  .route("/tournaments/:tournamentId/players/:playerId")
  .delete(deletePlayer);

module.exports = router;
