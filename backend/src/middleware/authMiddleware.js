const jwt = require("jsonwebtoken");
const prisma = require("../prisma.js");
const express = require("express");


const router = express.Router();

const authMiddleware = async (req, res, next) => {
  //READ the token from the request
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //usually comes in input: Authorization value: 'Bearer <token>
    token = req.headers.authorization.split(" ")[1]; // ["Bearer <token>"]
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "not finding the token in the cookies" });
  }
  try {
    //verifying the token is admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Once we verify the token we are geting the user.id ---> decoded.id from the data base with the admin privelages.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id, role: "ADMIN" },
    });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = user; //Once the function has been fully iterated through we can set the req.user = user

    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = authMiddleware;
