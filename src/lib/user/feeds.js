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

export async function createFeed(feedSpecs) {
	console.log(feedSpecs)

	let currentFeeds = await queryProtected("/users/feeds/create", feedSpecs)

	if (currentFeeds.status === "success") {
		await insertFeeds(currentFeeds.content)
	} else {
		console.log(`Failed to create "${feedSpecs.feed_name}" feed, with following error: `, currentFeeds.content)
	}
}

export async function getFeedNames(feeds) {
	return Array.from(Object.values(feeds), (category) => Object.keys(category)).flat()
}
