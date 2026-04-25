const { user} = require('../controllers/authController')
const express = require('express')

const userRoutes = express.Router()



userRoutes.post('/auth/register', user)



module.exports = userRoutes