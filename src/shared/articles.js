import { appConfig } from "./config.js";

import { articles, feedUpdates } from "./stores.js";
import { get } from "svelte/store";

export async function refreshArticles(currentFeeds) {

	for (const feedType of Object.keys(currentFeeds)) {
		for (let [feedName, feedDetails] of Object.entries(currentFeeds[feedType])) {
			refreshFeed(feedName, feedDetails["searchQuery"])
		}
	}
}

async function refreshFeed(feedName, feedSpecs) {
	let articleLists = get(articles);
	let currentFeedUpdates = get(feedUpdates);

	if (feedName in currentFeedUpdates) {
		if ((Date.now() - currentFeedUpdates[feedName]["time"]) / 60000 > appConfig.refreshRate || feedSpecs != articleLists[feedName]["feedSpecs"]) {
			fetchArticles(feedName, feedSpecs);
		}
	} else {
		feedUpdates.update((currentFeeds) => { currentFeeds[feedName] = Date.now(); return currentFeeds} )
		fetchArticles(feedName, feedSpecs);
	}

}

async function fetchArticles(feedName, feedSpecs = null){
	let queryUrl;

	if (feedSpecs) {
		let queryString = Object.keys(feedSpecs).map(key => key + '=' + feedSpecs[key]).join('&');
		queryUrl = `${appConfig.rootUrl}/articles/overview/search?${queryString}`;
	} else {
		queryUrl = `${appConfig.rootUrl}/articles/overview/newest`;
	}

	fetch(queryUrl)
	.then(response => response.json())
	.then(data => {
		articles.update((currentArticles) => { currentArticles[feedName] = {"feedSpecs" : feedSpecs, "articles" : data}; return currentArticles});
	}).catch(error => {
		return {};
	});
}
