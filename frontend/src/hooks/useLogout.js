import { useAuthContext } from "./useAuthContext"
import { useWebsitesContext } from "./useWebsitesContext"

export const useLogout = () => {

	const {dispatch} = useAuthContext()
	const {dispatch:websitesDispatch} = useWebsitesContext()

	const logout = () => {
		// remove user from local storage
		localStorage.removeItem('user')

		// dispatch logout action
		dispatch({type: 'LOGOUT'})
		websitesDispatch({type: 'SET_WEBSITES', payload: null})

	}

	return {logout}

}