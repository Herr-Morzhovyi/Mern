import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, useTheme, useMediaQuery } from '@mui/material'
import { useWebsitesContext } from "../hooks/useWebsitesContext"
import { useAuthContext } from '../hooks/useAuthContext'
import FlexBetween from './FlexBetween'
import {
	DownloadOutlined,
	AccessAlarmsOutlined
} from '@mui/icons-material'
import Header from './Header'
import StatBox from './StatBox'
import OverviewChart from './OverviewChart'
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined';
import MotionPhotosAutoOutlinedIcon from '@mui/icons-material/MotionPhotosAutoOutlined';

const SingleWebsite = () => {

	const {user} = useAuthContext()

	const theme = useTheme()

	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const { websiteName } = useParams()

	const { websites } = useWebsitesContext()

	const [data, setData] = useState(null);
	const [lastFetchTime, setLastFetchTime] = useState(null);

	const websiteDetails = websites.find(website => website.title === websiteName);

	const getRestData = async () => {
		try {
            const response = await fetch(websiteDetails.url + '/wp-json/rx-api/v1/get-wp-data');
            const jsonData = await response.json();
            setData(jsonData);
			setLastFetchTime(new Date())
			console.log('Got new data')

			fetch(`/api/websites/${websiteDetails._id}`, {
				method: 'PATCH',
				headers: {
					'Authorization': `Bearer ${user.token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ jsonData: jsonData })
			}).then(response => response.json())
			.then(data => {
				console.log('Success')
			}).catch(error => {
				console.error('Erroooooooor', error)
			})


        } catch (error) {
			console.error('Error fetching data:', error);
        }
	}

	useEffect(() => {

		try {
			const mostRecentHistory = websiteDetails.history.length > 0 ? websiteDetails.history[websiteDetails.history.length - 1] : null
			setData(mostRecentHistory.jsonData)
			console.log(data)
			console.log(data.timestamp)

		} catch (error) {
			console.error('Error fetching last history record from database', error)
		}
		
		// Clean up the interval when the component unmounts
	}, [websiteDetails.history, getRestData])

	const timeSinceLastFetch = lastFetchTime
    ? `${Math.floor((new Date() - lastFetchTime) / (1000 * 60))} minutes ago`
    : 'N/A';

	function countObj(obj) {
		let count = 0;

		for (const key in obj) {
		  if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
			count++;
		  }
		}
	  
		return count;
	}

  return (
	<Box m="1.5rem 2.5rem">
		<FlexBetween>
			<Header title={websiteName} subtitle="Single website overview" />

			<Box>
				<Button
				 	onClick={getRestData}
					sx={{
						backgroundColor: theme.palette.secondary.light,
						color: theme.palette.background.alt,
						fontSize: "14px",
						fontWeight: "bold",
						padding: "10px 20px",
					}}
				>
					<DownloadOutlined sx={{ mr: "10px" }} />
           			Refresh / {timeSinceLastFetch}
				</Button>
			</Box>
		</FlexBetween>
		{data ? (
			<Box
				mt="20px"
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="160px"
				gap="20px"
				sx={{
				"& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
				}}
			>
				<StatBox
				title="Website status"
				value={data && data.front_page_response.code}
				description={data && data.front_page_response.time + ' ms'}
				icon={
					<AccessAlarmsOutlined
					sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
					/>
				}
				/>
				<StatBox
				title="Wordpress core"
				value={data && data.pending_updates.core === null ? 'Up to date' : 'Update required'}
				description=""
				icon={
					<AccessAlarmsOutlined
					sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
					/>
				}
				/>
				
				<Box
				gridColumn="span 8"
				gridRow="span 2"
				backgroundColor={theme.palette.background.alt}
				p="1rem"
				borderRadius="0.55rem"
				>
					<OverviewChart view="sales" isDashboard={true} />
				</Box>
				
				<StatBox
				title="Plugin updates"
				value={data && data.pending_updates.plugins === false ? 0 : data.active_plugins.length - countObj(data.pending_updates.plugins.no_update)}
				description="Count plugins"
				icon={
					<BrowserUpdatedOutlinedIcon
					sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
					/>
				}
				/>
				<StatBox
				title="Active plugins"
				value={data && data.active_plugins.length}
				description=""
				icon={
					<MotionPhotosAutoOutlinedIcon
					sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
					/>
				}
				/>
			</Box>
			
		) : (
			<p>Loading</p>
		)}
		<span className="material-symbols-outlined sync" onClick={getRestData}>cloud_sync</span>
	</Box>
	
  )
}

export default SingleWebsite