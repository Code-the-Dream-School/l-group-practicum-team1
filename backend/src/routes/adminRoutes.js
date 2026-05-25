const {createTournament, getTournament, deleteTournament, getUsers, deleteUsers} = require('../controllers/adminController.js')
const express = require('express')
const adminRoutes = express.Router()

adminRoutes.post('/admin/createTournament', createTournament)

adminRoutes.get('/admin/tournament/:id', getTournament)

adminRoutes.delete('/admin/tournament/:id', deleteTournament)

adminRoutes.get('/admin/users', getUsers)

adminRoutes.delete('/admin/users/:id', deleteUsers)





module.exports = adminRoutes