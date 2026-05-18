const express = require("express");

const {
  getTournaments,
  getRounds,
  generateNextRound,
  createMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/tournamentController");
const router = express.Router();
router.route("/tournaments").get(getTournaments);
router.route("/tournaments/:tournamentId/rounds").get(getRounds);
router.route("/tournaments/:tournamentId/rounds").post(generateNextRound);
router.route("/rounds/:roundId/match").post(createMatch);
router.route("/matches/:matchId/").patch(updateMatch);
router.route("/matches/:matchId/").delete(deleteMatch);

module.exports = router;
