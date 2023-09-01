	import React from "react"
	import { ResponsivePie } from "@nivo/pie"
	import { Box, Typography, useTheme } from "@mui/material"


	const BreakdownChart = ({websiteDetails}) => {

		function formatSizeToMb(sizeInBytes) {
			return (sizeInBytes / 1024 / 1024).toFixed(2);
		}

		const theme = useTheme()

		const wpInstalationSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.core_size
		const themeSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.themes_size
		const pluginSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.plugins_size
		const cacheSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.cache_size
		const uploadsSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.uploads_size

		const totalSize = websiteDetails.history[websiteDetails.history.length - 1].jsonData.directory_size.total_size


		const formattedData = [
			{
				"id": 'themesSize',
				"label": 'Theme size',
				"value": formatSizeToMb(themeSize),
				"color": theme.palette.secondary[500]
			},
			{
				"id": 'pluginsSize',
				"label": 'Plugin size',
				"value": formatSizeToMb(pluginSize),
				"color": theme.palette.secondary[400]
			},
			{
				"id": 'cacheSize',
				"label": 'Cache size',
				"value": formatSizeToMb(cacheSize),
				"color": theme.palette.secondary[300]
			},
			{
				"id": 'uploadsSize',
				"label": 'Uploads size',
				"value": formatSizeToMb(uploadsSize),
				"color": theme.palette.secondary[200]
			},
			{
				"id": 'wpInstalSize',
				"label": 'WP installation',
				"value": formatSizeToMb(wpInstalationSize),
				"color": theme.palette.secondary[600]
			},
		]

	return (
		<Box
		height="600px"
		width="100%"
		minHeight="325px"
		minWidth="325px"
		position="relative"
		>
		<ResponsivePie
			sortByValue={true}
			data={formattedData}
			startAngle={-90}
			theme={{
			axis: {
				domain: {
				line: {
					stroke: theme.palette.secondary[200],
				},
				},
				legend: {
				text: {
					fill: theme.palette.secondary[200],
				},
				},
				ticks: {
				line: {
					stroke: theme.palette.secondary[200],
					strokeWidth: 1,
				},
				text: {
					fill: theme.palette.secondary[200],
				},
				},
			},
			legends: {
				text: {
				fill: theme.palette.secondary[200],
				},
			},
			tooltip: {
				container: {
				color: theme.palette.primary.main,
				},
			},
			}}
			colors={{ datum: "data.color" }}
			margin={{top: 40, right: 80, bottom: 100, left: 50}}
			innerRadius={0.45}
			activeOuterRadiusOffset={8}
			borderWidth={1}
			borderColor={{
			from: "color",
			modifiers: [["darker", 0.2]],
			}}
			arcLinkLabelsTextColor={theme.palette.secondary[200]}
			arcLinkLabelsThickness={2}
			arcLinkLabelsColor={{ from: "color" }}
			arcLabelsSkipAngle={10}
			arcLabelsTextColor={{
			from: "color",
			modifiers: [["darker", 2]],
			
			}}
			motionConfig="gentle"
			transitionMode="centerRadius"
			legends={[
			{
				anchor: "bottom",
				direction: "row",
				justify: false,
				translateX: 0,
				translateY: 50,
				itemsSpacing: 20,
				itemWidth: 85,
				itemHeight: 18,
				itemTextColor: "#999",
				itemDirection: "left-to-right",
				itemOpacity: 1,
				symbolSize: 18,
				symbolShape: "circle",
				effects: [
				{
					on: "hover",
					style: {
					itemTextColor: theme.palette.primary[500],
					},
				},
				],
			},
			]}
		/>
		<Box
			position="absolute"
			top="50%"
			left="50%"
			color={theme.palette.secondary[400]}
			textAlign="center"
			pointerEvents="none"
			sx={{
			transform: "translate(-75%, -170%)",
			}}
		>
			<Typography variant="h6">
			{`Total : ${formatSizeToMb(totalSize)} MB`} 
			</Typography>
		</Box>
		</Box>
	)
	}

	export default BreakdownChart