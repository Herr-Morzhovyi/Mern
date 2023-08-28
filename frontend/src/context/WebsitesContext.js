import { createContext, useReducer } from "react"

export const WebsitesContext = createContext()

export const websitesReducer = (state, action) => {
	switch (action.type) {
		case 'SET_WEBSITES':
			return {
				websites: action.payload
			}
		case 'CREATE_WEBSITE':
			return {
				websites: [action.payload, ...state.websites]
			}
		case 'DELETE_WEBSITE':
			return {
				websites: state.websites.filter((w) => w._id !== action.payload._id)
			}
		default:
			return state
	}
}

export const WebsitesContextProvider = ({ children }) => {

	const [state, dispatch] = useReducer(websitesReducer, {
		websites: null
	})

	
	return (
		<WebsitesContext.Provider value={{...state, dispatch}}>
			{ children }
		</WebsitesContext.Provider>
	)

}