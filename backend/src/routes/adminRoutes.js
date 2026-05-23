const {createTournament, getTournament, deleteTournament, getUsers} = require('../controllers/adminController.js')
const express = require('express')
const adminRoutes = express.Router()

adminRoutes.post('/admin/createTournament', createTournament)

adminRoutes.get('/admin/tournament/:id', getTournament)

adminRoutes.delete('/admin/tournament/:id', deleteTournament)

adminRoutes.get('/admin/users', getUsers)





module.exports = adminRoutes