require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const websiteRoutes = require('./routes/website')
const userRoutes = require('./routes/users')
const updateRoute = require('./routes/websiteUpdate')
const Website = require('./models/Website')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
	console.log(req.path, req.method)
	next()
})

const interval = 60 * 1000

// routes
app.use('/api/websites', websiteRoutes)
app.use('/api/user', userRoutes)

const sixHoursAgo = new Date(Date.now() - 2 * 60 * 1000)

setInterval(async () => {
	try {
		const websites = await Website.find({
			lastUpdateTime: { $lt: sixHoursAgo }
		}).limit(1);
  
		for (const website of websites) {
			try {
				const response = await fetch(website.url + '/wp-json/rx-api/v1/get-wp-data');
				const jsonData = await response.json();
	
				// Update the historical data for the website
				website.lastUpdateTime = new Date();
				website.history.push({ jsonData: jsonData, timestamp: new Date() });

				if (website.history.length > 60) {
					website.history.shift()
				}
				
				await website.save();
				console.log(`Website updated ${website.title}`)
			} catch (error) {
				console.error(`Error fetching data for ${website.title}:`, error);
			}
		}
		const attemptDate = new Date();
		console.log('Attempted update ' + attemptDate);
	} catch (error) {
		console.error('Error updating data:', error);
	}
}, interval)

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		// Listen for requests
		app.listen(process.env.PORT, () => {
			console.log('Listening on port 4000!')
		})
	})
	.catch((error) => {
		console.log(error)
	})

