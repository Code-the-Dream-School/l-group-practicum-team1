const { user, userLogin } = require('../controllers/authController')
const express = require('express')

const userRoutes = express.Router()
 


userRoutes.post('/auth/register', user)

//create the controller for these two routes below
userRoutes.post('/auth/login', userLogin)
// userRoutes.post('/auth/tournaments/:id/join', userJoin)
// userRouter.get('/users/me/tournaments', )


module.exports = userRoutes