import React, {useEffect} from 'react'
import { useWebsitesContext } from "../hooks/useWebsitesContext"
import { useAuthContext } from "../hooks/useAuthContext"
import WebsiteDetails from './WebsiteDetails'
import { Typography, Box } from '@mui/material'

const Dashboard = () => {

	const {websites, dispatch} = useWebsitesContext()
	const {user} = useAuthContext()

	useEffect(() => {
		const fetchWebsites = async () => {
			const response = await fetch('/api/websites', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			})
			const json = await response.json()

			if (response.ok) {
				dispatch({type: 'SET_WEBSITES', payload: json})
			}

		}
		if (user) {
			fetchWebsites()
		}
		
	}, [dispatch, user]) //dependancy array

  return (
	<Box className="home" m="1.5rem 2rem">
		<div className="websites">
			{/* If workouts exist we map through them */}
			{websites && websites.map(website => (
				<WebsiteDetails website={website} key={website._id} />
			))}
		</div>
	</Box>
  )
}

export default Dashboard