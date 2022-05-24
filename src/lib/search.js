import { state, modalState, feeds } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

export function search(searchQuery) {
	if (searchQuery) {

		console.log(searchQuery)

		Object.keys(searchQuery).forEach((k) => (!searchQuery[k]) && delete searchQuery[k]);

		console.log(searchQuery)

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
