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

  // destructuring the values from the userSchema test of the req.body
  const { firstName, lastName, password, email } = value;

  //Hashing the password and deleting the natural password for security
  const hashedPassword = await bcrypt.hash(password, 10);
  delete value.password;

  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
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
  //checking if req.body has email and password
  if(!req.body || !req.body.email || !req.body.password){
    res.status(StatusCodes.BAD_REQUEST)
  }
  //destructuring the values from the req.body
  let { email, password } = req.body

  //email to lowerCase for comparison
  email = email.toLowerCase();

  //checking the database for the email
  const user = await prisma.user.findUnique({
    where: {email}
  })

  //if not user return a error message
  if(!user){
    return res.status(StatusCodes.UNAUTHORIZED).json({message: "Not Authorized"})
  }

  const isPassword = await bcrypt.compare(password, user.hashedPassword)
  if(!isPassword){
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password"})
  }


  res.json({ message: "You are logged in" });
};

//Logout
const logout = async (req, res) => {
  res.end("user has logged out");
};

module.exports = { register, login, logout };


