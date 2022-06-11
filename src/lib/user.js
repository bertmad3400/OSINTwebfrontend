import { loginState, feeds, collectionList, collectionArticles } from "../shared/stores.js"
import { appConfig } from "../shared/config.js";
import { resetState } from "./state.js"

import { get } from "svelte/store"

import { updateArticleListing } from "./articles/main.js"

export async function queryProtected(queryURL, body = null) {
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

	if (queryResult.status == 401) {
		resetState()
		return {"status" : "not-auth", "content" : "User needs to be logged in to access this feature"}
	} else {
		loginState.update(currentState => {
			currentState.loggedIn = true
			return currentState
		})

		try {
			if (queryResult.ok) {
				return {"status" : "success", "content" : await queryResult.json()}
			} else {
				console.log("Error in query: ", queryResult)
				return {"status" : "failure", "content" : (await queryResult.json())["detail"] }
			}
		} catch {
			return {"status" : "failure", "content" : "An unexpected error occured, please try again"}
		}
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

	if (currentFeeds.status === "success") {
		await insertFeeds(currentFeeds.content)
	} else {
		console.log("Failed to get user feeds, with following error: ", currentFeeds.content)
	}
}
