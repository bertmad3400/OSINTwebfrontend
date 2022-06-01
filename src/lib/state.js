import { modalState, feeds, state, loginState, currentSearch } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

export function showSearchModal() {
	modalState.set({"modalType" : "search", "modalContent" : null})
	document.activeElement.blur()
}

export async function resetState() {
	feeds.set(structuredClone(appConfig.feeds))
	state.set(structuredClone(appConfig.defaultOptions.state))
	modalState.set(structuredClone(appConfig.defaultOptions.modalState))
	loginState.set(structuredClone(appConfig.defaultOptions.loginState))
	currentSearch.set(structuredClone(appConfig.defaultOptions.search))
}
