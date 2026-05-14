const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const tournamentRouter = require("./routes/tournamentRouters");
const adminRoutes = require("./routes/adminRoutes")

const app = express();

// Security & best‑practice middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
//admin routes
app.use("/api/", adminRoutes)

//register, login, logout routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/", userRoutes);

//tournament enpoints
app.use("/api/", tournamentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

module.exports = app;
