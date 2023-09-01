const Website = require('../models/Website')
const mongoose = require('mongoose')

// todo: Get all Websites
const getAllWebsites = async (req, res) => {

	const user_id = req.user._id
	const websites = await Website.find({user_id}).sort({createdAt: -1})

	res.status(200).json(websites)
}

// todo: Get a single Website
const getWebsite = async (req, res) => {
	const { id } = req.params

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({error: 'No such Website'})
	}




	const website = await Website.findById(id)

	if (!website) {
		return res.status(400).json({error: 'No such Website'})
	}

	res.status(200).json(website)
}

// todo: Create new Website
const createWebsite = async (req, res) => {
	const {title, url, status} = req.body

	let emptyFields = []

	if (!title) {
		emptyFields.push('title')
	}

	if (!url) {
		emptyFields.push('url')
	}

	if (!status) {
		emptyFields.push('status')
	}

	if (emptyFields.length > 0) {
		return res.status(400).json({ error: 'Please fill in all the fields!', emptyFields })
	}

	// Adding doc to DB
	try {
		const user_id = req.user._id
		const website = await Website.create({title, url, status, user_id})
		res.status(200).json(website)
	} catch (error) {
		res.status(400).json({error: error.message})
	}
}



// todo: Delete a Website
const deleteWebsite = async (req, res) => {
	const { id } = req.params

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({error: 'No such Website'})
	}

	const website = await Website.findOneAndDelete({_id: id})

	if (!website) {
		return res.status(400).json({error: 'No such Website'})
	}

	res.status(200).json(website)

}

// todo: Update a Website
// ! PATCH request
const updateWebsite = async (req, res) => {

	const {id} = req.params
	const newJsonData = req.body.jsonData

	console.log('We are doing something')

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({error: 'No such Website'})
	}

	try {
		const website = await Website.findById(id)

		if (!website) {
			return res.status(400).json({error: 'No such Website'})
		}

		website.history.push({ jsonData: newJsonData })

		if (website.history.length > 60) {
			website.history.shift()
		}

		website.lastUpdateTime = new Date()

		await website.save()

		res.json({ message: 'Data updated successfully' })

		console.log('Data updated successfully')
	} catch (error) {

		console.error('Error updating data:', error)
		res.status(500).json({ message: 'An error occurred' })

	}

	
}

const renewWebsite = async (req, res) => {
	const {id} = req.params

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({error: 'No such Website'})
	}

	


	try {
		const website = await Website.findById(id)

		const response = await fetch(website.url + '/wp-json/rx-api/v1/get-wp-data')
		const newData = await response.json()

		if (!website) {
			return res.status(400).json({error: 'No such Website'})
		}

		website.history.push({ jsonData: newData })

		if (website.history.length > 60) {
			website.history.shift()
		}

		website.lastUpdateTime = new Date()

		await website.save()

		res.json({ message: 'Data updated successfully', website: website })

		console.log('Data updated successfully')
	} catch (error) {

		console.error('Error updating data:', error)
		res.status(500).json({ message: 'An error occurred', error: error })

	}

}

module.exports = {
	createWebsite,
	getAllWebsites,
	getWebsite,
	deleteWebsite,
	updateWebsite,
	renewWebsite
}