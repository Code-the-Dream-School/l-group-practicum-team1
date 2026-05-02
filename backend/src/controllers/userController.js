require("dotenv").config()
const bcrypt = require('bcryptjs')
const {statusCodes} = require('http-status-codes')
const { userSchema}  = require('../../validations/userValidation.js')
// const { PrismaClient } = require('@prisma/client')
const prisma = require('../prisma.js')









//Register
const register = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password){
        res.status(statusCodes.BAD_REQUEST)
    }
    
    const {error, value} = userSchema.validate(req.body) //validating the request body received from the user. 

    const hashedpassword = await bcrypt.hash(password, 10)




   


}



//Login ---> awaiting Prisma and data base string 
const login = async (req, res) => {
    res.json({ message: 'This will be the login '})
}




//Logout
const logout = async (req, res) => {
    res.end('user has logged out')
}



module.exports = {register, login, logout};