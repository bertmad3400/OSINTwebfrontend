import { appConfig } from "./config.js";

import { articles, feedUpdates } from "./stores.js";
import { get } from "svelte/store";

export async function refreshArticles(currentFeeds) {

	for (let [feedName, feedSpecs] of Object.entries(currentFeeds)) {
		refreshFeed(feedName, feedSpecs)
	}

	console.log(get(articles))

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
		console.log(queryUrl, data)
		articles.update((currentArticles) => { currentArticles[feedName] = {"feedSpecs" : feedSpecs, "articles" : data}; return currentArticles});
	}).catch(error => {
		console.log(error);
		return {};
	});
}
