import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, useTheme, useMediaQuery, Typography } from '@mui/material'
import { useWebsitesContext } from "../hooks/useWebsitesContext"
import { useAuthContext } from '../hooks/useAuthContext'
import FlexBetween from './FlexBetween'
import { DataGrid } from "@mui/x-data-grid";
import {
	DownloadOutlined,
	AccessAlarmsOutlined
} from '@mui/icons-material'
import Header from './Header'
import StatBox from './StatBox'
import OverviewChart from './OverviewChart'
import BreakdownChart from './BreakdownChart'
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined';
import MotionPhotosAutoOutlinedIcon from '@mui/icons-material/MotionPhotosAutoOutlined';

const SingleWebsite = () => {

	const {user} = useAuthContext()
	
	const theme = useTheme()

	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const { websiteName } = useParams()

	const { websites } = useWebsitesContext()

	const websiteDetails = websites.find(website => website.title === websiteName)

	// States
	const [historyDataCounter, setHistoryDataCounter] = useState(1)

	const [data, setData] = useState(null);

	const [rows, setRows] = useState([])

	// Functions
	// * Paginate plugin list through history array on btn click
	const incrementHistory = async () => {
		setHistoryDataCounter(historyDataCounter + 1)
	}
	const decrementHistory = async () => {
		setHistoryDataCounter(historyDataCounter - 1)
	}

	function timestampToMinutes(timestamp) {
		const parsedDate = new Date(timestamp);
		const currentDate = new Date();
		const timeDifferenceInMillis = currentDate - parsedDate;
		const minutes = Math.floor(timeDifferenceInMillis / (1000 * 60));
		return minutes;
	}

	const getRestData = async () => {

		try {
            // const response = await fetch(websiteDetails.url + '/wp-json/rx-api/v1/get-wp-data');
            // const jsonData = await response.json();
            // setData(jsonData);
			// console.log('Got new data')

			const response = await fetch(`/api/websites/${websiteDetails._id}/renew`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${user.token}`,
					'Content-Type': 'application/json'
				}
			})

			const json = await response.json()

			setData(json.website.history[json.website.history.length - 1].jsonData)
			console.log(json.website)


        } catch (error) {
			console.error('Error fetching data:', error);
        }
	}

	// let plugins_list = {}
	
	// if (websiteDetails.history[websiteDetails.history.length - historyDataCounter].jsonData.plugins_list.plugins) {

	// 	plugins_list = websiteDetails.history[websiteDetails.history.length - historyDataCounter].jsonData.plugins_list.plugins

	// }



	// if (websiteDetails.history[websiteDetails.history.length - 1].jsonData.code !== 'rest_no_route') {
	// 	setRows(Object.values(plugins_list))
	// }

	

	useEffect(() => {

		if (websiteDetails.history.length > 0) {
			const mostRecentHistory = websiteDetails.history[websiteDetails.history.length - historyDataCounter];
			if (mostRecentHistory && mostRecentHistory.jsonData) {
			  setData(mostRecentHistory.jsonData);
			  if (mostRecentHistory.jsonData.plugins_list.plugins) {
				setRows(Object.values(mostRecentHistory.jsonData.plugins_list.plugins));
			  }
			}
		}

	}, [historyDataCounter, websiteDetails])

	const timeSinceLastFetch = `${timestampToMinutes(websiteDetails.lastUpdateTime)} minutes ago`

	function countObj(obj) {
		let count = 0;

		for (const key in obj) {
		  if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
			count++;
		  }
		}
	  
		return count;
	}

	function count_plugins_updates(pluginList) {

		let count = 0

		function traverseObject(obj) {
			for (const key in obj) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					traverseObject(obj[key]);
				} else if (key === 'update' && obj[key] === 'yes') {
					count++;
				}
			}
		}

		traverseObject(pluginList);
  		return count;

	}

	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
		},
		{
			field: "name",
			headerName: "Plugin name",
			flex: 1,
		},
		{
			field: "current_version",
			headerName: "Version",
			flex: 1,
		},
		{
			field: "update",
			headerName: "Update available",
			flex: 1,
		},
	];

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
			{data && data.code !== 'rest_no_route' ? (
				<Box>
					<Box
						mt="20px"
						mb="20px"
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
							<OverviewChart websiteDetails={websiteDetails} isDashboard={true} />
						</Box>
						
						<StatBox
						title="Plugin updates"
						value={data && count_plugins_updates(data.plugins_list.plugins)}
						description="Count plugins"
						icon={
							<BrowserUpdatedOutlinedIcon
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
							/>
						}
						/>
						<StatBox
						title="Active plugins"
						value={data && countObj(data.plugins_list.plugins)}
						description=""
						icon={
							<MotionPhotosAutoOutlinedIcon
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
							/>
						}
						/>
					</Box>
					{/* ROW 2 */}
					<Box
						backgroundColor={theme.palette.background.alt}
						p="1.5rem"
						borderRadius="0.55rem"
						>
						<Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
							Website size (in MB)
						</Typography>
						<BreakdownChart websiteDetails={websiteDetails} />
						<Typography
							p="0 0.6rem"
							fontSize="0.8rem"
							sx={{ color: theme.palette.secondary[200] }}
						>
							Breakdown of website directory sizes.
						</Typography>
					</Box>
					<Box
					mt="20px"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
					sx={{
						"& .MuiDataGrid-root": {
						border: "none",
						borderRadius: "5rem",
						},
						"& .MuiDataGrid-cell": {
						borderBottom: "none",
						},
						"& .MuiDataGrid-columnHeaders": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderBottom: "none",
						},
						"& .MuiDataGrid-virtualScroller": {
						backgroundColor: theme.palette.background.alt,
						},
						"& .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderTop: "none",
						},
						"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.secondary[200]} !important`,
						},
					}}>
						<FlexBetween>
							<Button
							disabled={historyDataCounter === 1}
							onClick={decrementHistory}
							sx={{
								backgroundColor: theme.palette.secondary.light,
								color: theme.palette.background.alt,
								fontSize: "14px",
								fontWeight: "bold",
								padding: "10px 20px",
							}}>More recent data</Button>
							<Button
							disabled={historyDataCounter === 59}
							onClick={incrementHistory}
							sx={{
								backgroundColor: theme.palette.secondary.light,
								color: theme.palette.background.alt,
								fontSize: "14px",
								fontWeight: "bold",
								padding: "10px 20px",
							}}>Older data</Button>
						</FlexBetween>
						<DataGrid
							getRowId={(row) => row.id}
							rows={rows}
							columns={columns}
						/>
					</Box>
				</Box>
			) : (
				<Box
					mt="20px"
					mb="20px"
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
				</Box>
			)}
		</Box>
		
	)
}

export default SingleWebsite