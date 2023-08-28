import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './components/Dashboard'
import { useAuthContext } from './hooks/useAuthContext'
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import SingleWebsite from './components/SingleWebsite'

import { CssBaseline, ThemeProvider } from "@mui/material";
import AddNewWebsite from './components/AddNewWebsite'




function App() {

	const mode = useSelector((state) => state.global.mode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	const {user} = useAuthContext()

	return (
		<div className="App">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					
					
					<Routes>
						<Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
						<Route path='/signup' element={!user ? <Signup /> : <Navigate to="/" />} />
						<Route element={user ? <Home /> : <Navigate to="/login" />}>
							<Route path='/' element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login"/>} />
							<Route path='/dashboard' element={<Dashboard />} />
							<Route path='/dashboard/:websiteName' element={<SingleWebsite />} />
							<Route path='/add_new' element={<AddNewWebsite />} />
						</Route>
					</Routes>
			
				</ThemeProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
