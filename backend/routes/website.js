const express = require('express')
const {
	createWebsite,
	getAllWebsites,
	getWebsite,
	deleteWebsite,
	updateWebsite
} = require('../controllers/websiteController')

const  requireAuth = require('../middleware/requireAuth')


const router = express.Router()

// Require auth for all actions
router.use(requireAuth)

// GET
router.get('/', getAllWebsites) // no need to ()
// GET singular
router.get('/:id', getWebsite)
// POST
router.post('/', createWebsite)
// Delete
router.delete('/:id', deleteWebsite)
// Update
router.patch('/:id', updateWebsite)

module.exports = router