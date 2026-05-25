const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const tournamentRouter = require("./routes/tournamentRouters");
const playerRouter = require("./routes/playerRoutes.js");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware.js");
const cookieParser = require("cookie-parser");
const app = express();

// Security & best‑practice middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//register, login, logout routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/", userRoutes);

//Protected admin routes
app.use("/api/", authMiddleware, adminRoutes);

//player endpoints
app.use("/api/", playerRouter);
//tournament enpoints
app.use("/api/", tournamentRouter);

//Protected admin routes
app.use("/api/", authMiddleware, adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

module.exports = app;
