require("dotenv").config();
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const userSchema = require("../../validations/userValidation.js");
// const { PrismaClient } = require('@prisma/client')
const prisma = require("../prisma.js");

//Register
const register = async (req, res) => {
  if (!req.body) req.body = {};
  console.log("req.body:", req.body);
  const { error, value } = userSchema.validate(req.body); //validating the request body received from the user.

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  const { firstName, lastName, password, email } = value;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    },
  });

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "missing some valid information",
    });
  }
  res.status(201).json({
    message: "User created",
  });
};

//Login ---> awaiting Prisma and data base string
const login = async (req, res) => {
  res.json({ message: "This will be the login " });
};

//Logout
const logout = async (req, res) => {
  res.end("user has logged out");
};

module.exports = { register, login, logout };
