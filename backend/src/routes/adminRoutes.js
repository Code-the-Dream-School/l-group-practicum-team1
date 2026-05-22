const {
  createTournament,
  getTournament,
  deleteTournament,
  getUsers,
  searchUsers,
} = require("../controllers/adminController.js");
const express = require("express");
const adminRoutes = express.Router();

adminRoutes.post("/admin/createTournament", createTournament);

adminRoutes.get("/admin/tournament/:id", getTournament);

adminRoutes.delete("/admin/tournament/:id", deleteTournament);

adminRoutes.get("/admin/users", getUsers);
adminRoutes.get("/admin/searchUsers", searchUsers);

module.exports = adminRoutes;
