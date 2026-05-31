const {
  register,
  login,
  logout,
  getMe,
  updateMe,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const userRoutes = express.Router();

userRoutes.get("/auth/me", authMiddleware, getMe);
userRoutes.patch("/auth/me", authMiddleware, updateMe);
userRoutes.post("/auth/register", register);
userRoutes.post("/auth/login", login);
userRoutes.post("/auth/logout", logout);

//create the controller for these two routes below

// userRoutes.post('/auth/tournaments/:id/join', jo
// userRouter.get('/users/me/tournaments', ) ----> find the tournaments which the user_id is in and return the bracket

module.exports = userRoutes;
