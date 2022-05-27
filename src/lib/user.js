import { loginState, feeds } from "../shared/stores.js"
import { appConfig } from "../shared/config.js";

async function queryProtected(queryURL, defaultResponse = false, body = null) {
	let headers

	if (body) {
		headers = {
			credentials : "include",
			method : "POST",
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify(body)
		}
	} else {
		headers = {
			credentials : "include"
		}
	}

	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`, headers)

	if (queryResult.ok) {
		loginState.update(currentState => {
			currentState.loggedIn = true
			return currentState
		})

		return await queryResult.json()

	} else if (queryResult.status == 401) {
		loginState.set({
			"loggedIn" : false,
			"userObject" : {}
		})

		return defaultResponse
	}
}

async function insertFeeds(feedSpecs) {

	let newFeeds = Object.fromEntries(feedSpecs.map(feed => { return [feed.feed_name, {"searchQuery" : feed, "type" : "feed"}] }) )

	feeds.update(userFeeds => {
		userFeeds.userFeeds = newFeeds
		return userFeeds
	})
}

export async function getUserFeeds() {
	let currentFeeds = await queryProtected("/users/feeds/list")

	if (currentFeeds) {
		await insertFeeds(currentFeeds)
	}
}
