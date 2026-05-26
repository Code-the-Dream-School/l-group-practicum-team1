const express = require("express");
const authMiddleware = require("../middleware/authMiddleware")

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
router.route("/tournaments/:tournamentId/rounds").post(authMiddleware, generateNextRound);
router.route("/rounds/:roundId/match").post(authMiddleware, createMatch);
router.route("/matches/:matchId/").patch(authMiddleware, updateMatch);
router.route("/matches/:matchId/").delete(authMiddleware, deleteMatch);

module.exports = router;
