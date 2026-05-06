const express = require("express");

const { getTournaments } = require("../controllers/tournamentController");
const router = express.Router();
router.route("/tournaments").get(getTournaments);

module.exports = router;
