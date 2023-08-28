import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from '@mui/material';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import FlexBetween from "./FlexBetween";


const navItems = [
	{
		text: "Dashboard",
		icon: <HomeOutlined/>,
		link: 'dashboard'
	},
	{
		text: "Add new website",
		icon: <AddCircleOutlineIcon/>,
		link: 'add_new'
	}
]

const Sidebar = ({
	drawerWidth,
	isSidebarOpen,
	setIsSidebarOpen,
	isNonMobile,
}) => {
	const { pathname } = useLocation();
	const [active, setActive] = useState("");
	const navigate = useNavigate();
	const theme = useTheme();

	useEffect(() => {
		setActive(pathname.substring(1));
	}, [pathname]);

	const user = useAuthContext();

	return (
		<Box component="nav">
			{isSidebarOpen && <Drawer
				open={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				variant="persistent"
				anchor="left"
				sx={{
				  width: drawerWidth,
				  "& .MuiDrawer-paper": {
					color: theme.palette.secondary[200],
					backgroundColor: theme.palette.background.alt,
					boxSixing: "border-box",
					borderWidth: isNonMobile ? 0 : "2px",
					width: drawerWidth,
				  },
				}}
			>
				<Box width="100%">
					<Box m="1.5rem 2rem 2rem 3rem">
					<FlexBetween color={theme.palette.secondary.main}>
						<Box display="flex" alignItems="center" gap="0.5rem">
						<Typography variant="h4" fontWeight="bold">
							RASAMAX
						</Typography>
						</Box>
						{!isNonMobile && (
						<IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
							<ChevronLeft />
						</IconButton>
						)}
					</FlexBetween>
					</Box>
					<List>
					{user && navItems.map(({ text, icon, link }) => {
						if (!icon) {
						return (
							<Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
							{text}
							</Typography>
						);
						}

						return (
						<ListItem key={text} disablePadding>
							<ListItemButton
							onClick={() => {
								navigate(link);
								setActive(link);
							}}
							sx={{
								backgroundColor:
								active === link
									? theme.palette.secondary[300]
									: "transparent",
								color:
								active === link
									? theme.palette.primary[600]
									: theme.palette.secondary[100],
							}}
							>
							<ListItemIcon
								sx={{
								ml: "2rem",
								color:
									active === link
									? theme.palette.primary[600]
									: theme.palette.secondary[200],
								}}
							>
								{icon}
							</ListItemIcon>
							<ListItemText primary={text} />
							{active === link && (
								<ChevronRightOutlined sx={{ ml: "auto" }} />
							)}
							</ListItemButton>
						</ListItem>
						);
					})}
					</List>
				</Box>
			</Drawer>}
		</Box>
	)
}

export default Sidebar