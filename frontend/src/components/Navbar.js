import React from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


const Navbar = () => {

	const {logout} = useLogout()
	const {user} = useAuthContext()

	const handleClick = () => {
		logout()
	}


  return (
	<header>
		<div className='container'>
			<Link to="/">
				<h1>Rasamax console</h1>
			</Link>
			<nav>
				{user && (
					<Grid container spacing={2} alignItems="center" justifyContent="space-between">
						<Grid item>
							{user.email}
						</Grid>
						<Grid item>
							<Button variant='contained' onClick={handleClick}>Log out</Button>
						</Grid>
						
					</Grid>
				)}
				{!user && (
					<Grid container spacing={2} alignItems="center" justifyContent="space-between">
						<Grid item>
							<Button variant='outlined'>
								<Link to="/login">Log in</Link>
							</Button>
						</Grid>
						<Grid item>
							<Button variant='contained' >
								<Link to="/signup">Sign up</Link>
							</Button>
						</Grid>
					</Grid>
				)}
			</nav>
		</div>
	</header>
  )
}

export default Navbar