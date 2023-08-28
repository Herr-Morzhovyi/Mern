import { WebsitesContext } from "../context/WebsitesContext"
import { useContext } from "react"

export const useWebsitesContext = () => {
	const context = useContext(WebsitesContext)

	if (!context) {
		throw Error('useWebsitesContext must be used inside an WebsitesContextProvider')
	}

	return context
}