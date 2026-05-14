const createTournament = require('../controllers/adminController.js')
const express = require('express')
const adminRoutes = express.Router()

adminRoutes.post('/admin/createTournament', createTournament)





module.exports = adminRoutes