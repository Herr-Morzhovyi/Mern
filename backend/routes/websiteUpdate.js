const express = require('express')

const router = express.Router()

router.post('/update', async (req, res) => {
	try {
		const websites = await Website.find();
  
		for (const website of websites) {
			try {
				const response = await fetch(website.url + '/wp-json/rx-api/v1/get-wp-data');
				const jsonData = await response.json();
	
				// Update the historical data for the website
				website.history.push({ jsonData: jsonData, timestamp: new Date() });

				if (website.history.length > 60) {
					website.history.shift()
				}
				
				await website.save();
				console.log('Website updated')
			} catch (error) {
				console.error(`Error fetching data for ${website.title}:`, error);
			}
		}
	
			console.log('Fetched and updated data for all websites');
			res.status(200).json({ message: 'Data fetched and updated' });
	} catch (error) {
			console.error('Error updating data:', error);
			res.status(500).json({ message: 'An error occurred' });
	}
})

module.exports = router