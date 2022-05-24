import { state, modalState, feeds } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

export function search(searchQuery) {
	if (searchQuery) {

		// Remove values that are null or empty, as those can be problematic when calling the API
		Object.keys(searchQuery).forEach((k) => (!searchQuery[k] || searchQuery[k].length === 0) && delete searchQuery[k]);

		feeds.update(currentFeeds => {
			currentFeeds["newFeed"] = {"Custom search" : { "searchQuery" : { "limit" : appConfig.defaultLimit, ...searchQuery } } }

			return currentFeeds
		})

		state.update(currentState => {
			currentState.selectedMenu = {"name" : "Custom search", "type" : "feed"}
			currentState.localSearch = ""
			return currentState
		})

		modalState.set({ "modalType" : null, "modalContent" : null })
	}
}
