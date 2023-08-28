import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WebsitesContextProvider } from "./context/WebsitesContext";
import { AuthContextProvider } from "./context/AuthContex";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state";


import { Provider } from "react-redux";

const store = configureStore({
	reducer: {
		global: globalReducer,
	}
});

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
	<React.StrictMode>
		<AuthContextProvider>
			<Provider store={store}>
				<WebsitesContextProvider>
					<App />
				</WebsitesContextProvider>
			</Provider>
		</AuthContextProvider>
	</React.StrictMode>
);
