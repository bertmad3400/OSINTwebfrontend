import { state, modalState, feeds } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

export function search(searchQuery) {
	if (searchQuery) {

		// Remove values that are null or empty, as those can be problematic when calling the API
		Object.keys(searchQuery).forEach((k) => {
			if (!searchQuery[k] || searchQuery[k].length === 0) delete searchQuery[k];
			if (k.toLowerCase().includes("date") && searchQuery[k]) {
				console.log(searchQuery[k], new Date(searchQuery[k]))
				searchQuery[k] = (new Date(searchQuery[k])).toISOString();
			}
		});

		feeds.update(currentFeeds => {
			currentFeeds["newFeed"] = {"Custom search" : { "searchQuery" : { "limit" : appConfig.defaultOptions.search.limit, ...searchQuery } } }

			return currentFeeds
		})

		state.update(currentState => {
			currentState.selectedMenu = {"name" : "Custom search", "type" : "search"}
			currentState.localSearch = ""
			return currentState
		})

		modalState.set({ "modalType" : null, "modalContent" : null })
	}
}
