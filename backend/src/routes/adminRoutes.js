const {createTournament, getTournament} = require('../controllers/adminController.js')
const express = require('express')
const adminRoutes = express.Router()

adminRoutes.post('/admin/createTournament', createTournament)

adminRoutes.get('/admin/tournament/:id', getTournament)





module.exports = adminRoutes