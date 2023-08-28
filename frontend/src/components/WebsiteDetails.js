import { useWebsitesContext } from "../hooks/useWebsitesContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography, useTheme, CardActions, Collapse, Button } from '@mui/material'
// datefns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from "react-router-dom"

const WebsiteDetails = ({ website }) => {

	const theme = useTheme()

	const {dispatch} = useWebsitesContext()
	const {user} = useAuthContext()

	useEffect(() => {
		
	})

	const handleClick = async () => {

		if (!user) return
 
		const response = await fetch('/api/websites/' + website._id, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${user.token}`
			}
		})
		const json = await response.json()

		if (response.ok) {
			dispatch({type: 'DELETE_WEBSITE', payload: json})
		}
	}

	
	const [isExpanded, setIsExpanded] = useState(false);

	

	return (
		<Card
			sx={{
				backgroundImage: "none",
				backgroundColor: theme.palette.background.alt,
				borderRadius: "0.55rem",
			}}
			className="single-website"
		>
			<CardContent className="single-website-card">
				<Typography
					color={theme.palette.secondary[700]}
					gutterBottom
					variant="h2"
					component="h2"
					sx={{
						marginRight: '3rem'
					}}
				>{website.title}</Typography>
				<span className="material-symbols-outlined delete" onClick={handleClick}>delete</span>
				<CardActions sx={{ p: "1rem 0" }}>
					<Button
					variant="contained"
					size="small"
					onClick={() => setIsExpanded(!isExpanded)}
					color={theme.palette.background[500]}
					>
					See More
					</Button>
					<Button
					variant="contained"
					size="small"
					onClick={() => setIsExpanded(!isExpanded)}
					color={theme.palette.background[500]}
					>
					<Link to={`/dashboard/${website.title}`}>Open overview</Link>
					</Button>
				</CardActions>
				<Collapse
					in={isExpanded}
					timeout="auto"
					unmountOnExit
					sx={{
					color: theme.palette.neutral[300],
					}}
				>
					<Typography variant="body2">{website.status}</Typography>
					<Typography variant="body2">{website.url}</Typography>
					<Typography variant="body2">{website.lastUpdateTime}</Typography>
					{/* File size */}
				</Collapse>
			</CardContent>
		</Card>
	)
}

export default WebsiteDetails