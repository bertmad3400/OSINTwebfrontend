import { modalState, feeds, state, loginState, currentSearch } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

export function showSearchModal() {
	modalState.set({"modalType" : "search", "modalContent" : null})
	document.activeElement.blur()
}

export async function resetState() {
	feeds.set(appConfig.feeds)
	state.set(appConfig.defaultOptions.state)
	modalState.set(appConfig.defaultOptions.modalState)
	loginState.set(appConfig.defaultOptions.loginState)
	currentSearch.set(appConfig.defaultOptions.search)
}
