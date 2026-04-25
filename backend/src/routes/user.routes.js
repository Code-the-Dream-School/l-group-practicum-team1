const { register, login, logout } = require('../controllers/userController')
const express = require('express')

const userRoutes = express.Router()
 


userRoutes.post('/auth/register', register)
userRoutes.post('/auth/login', login)
userRoutes.post('/auth/logout', logout)

//create the controller for these two routes below

// userRoutes.post('/auth/tournaments/:id/join', userJoin)
// userRouter.get('/users/me/tournaments', )


module.exports = userRoutes