import { feeds } from "../../shared/stores.js"

import { queryProtected } from "./main.js"

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
