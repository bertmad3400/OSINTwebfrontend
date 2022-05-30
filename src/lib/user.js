import { loginState, feeds, collectionList, collectionArticles } from "../shared/stores.js"
import { appConfig } from "../shared/config.js";
import { resetState } from "./state.js"

import { get } from "svelte/store"

import { updateArticleListing } from "./articles/main.js"

export async function queryProtected(queryURL, defaultResponse = false, body = null) {
	let headers

	if (body != null) {
		headers = {
			credentials : "include",
			method : "POST",
			headers: {'Content-Type': 'application/json'},
			body : body ? JSON.stringify(body) : null
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
		resetState()
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
