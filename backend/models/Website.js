const mongoose = require('mongoose')

const Schema = mongoose.Schema

const historySchema = new mongoose.Schema({
	jsonData: Object,
	timestamp: {type: Date, default: Date.now}
})

const websiteSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	history: [
		historySchema
	],
	user_id: {
		type: String,
		required: true
	},
	lastUpdateTime: {type: Date, default: Date.now}
}, { timestamps: true })

module.exports = mongoose.model('Website', websiteSchema)