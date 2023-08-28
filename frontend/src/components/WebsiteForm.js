import React, { useState } from "react";
import { useWebsitesContext } from "../hooks/useWebsitesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Container, CssBaseline, Grid, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const WebsiteForm = () => {

	const {dispatch} = useWebsitesContext()
	const {user} = useAuthContext()

	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [status, setStatus] = useState('')
	const [error, setError] = useState(null)
	const [emptyFields, setEmptyFields] = useState([])

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!user) {
			setError('You must be logged in')
			return
		}

		const website = {title, url, status}

		const response = await fetch('/api/websites', {
			method: 'POST',
			body: JSON.stringify(website),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.token}`
			}
		})
		const json = await response.json()

		if (!response.ok) {
			setError(json.error)
			setEmptyFields(json.emptyFields)
		}
		if (response.ok) {
			setTitle('')
			setUrl('')
			setStatus('')
			setError(null)
			setEmptyFields([])
			console.log('New website added')
			dispatch({type: 'CREATE_WEBSITE', payload: json})
		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}>
				<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
					<CreateNewFolderIcon />
				</Avatar>
				<Typography component="h1" variant="h5">Add a new Website</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="title"
								type="text"
								label="Website Title"
								name="title"
								onChange={(e) => setTitle(e.target.value)}
								value={title}
								className={emptyFields.includes('title') ? 'error' : ''}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="url"
								label="Url"
								type="text"
								id="url"
								onChange={(e) => setUrl(e.target.value)}
								value={url}
								className={emptyFields.includes('url') ? 'error' : ''}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel id="status-select">Status</InputLabel>
								<Select
									required
									fullWidth
									label="Status"
									id="status"
									labelID="status-select"
									onChange={(e) => setStatus(e.target.value)}
									value={status}
									className={emptyFields.includes('status') ? 'error' : ''}
								>
									<MenuItem value={'alive'}>Alive</MenuItem>
									<MenuItem value={'dead'}>Dead</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Add website
					</Button>
					{error && <Box className="error">{error}</Box>}
				</Box>
			</Box>

		</Container>
	)
};

export default WebsiteForm;
