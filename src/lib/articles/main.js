import { appConfig } from "../../shared/config.js";

import { articles, feedUpdates } from "../../shared/stores.js";
import { get } from "svelte/store";

async function queryAPI(queryURL, defaultResponse = null) {
	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`)

	if (queryResult.ok) {
		return await queryResult.json()
	} else {
		return defaultResponse
	}
}

export async function getArticleCategories() {
	return queryAPI("/articles/categories", {})
}

export async function getArticleContent(articleID) {
	return queryAPI(`/articles/content?IDs=${articleID}`, [{}])
}

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
	let fetchedArticles;

	if (feedSpecs) {
		let queryString = Object.keys(feedSpecs).map(key => key + '=' + feedSpecs[key]).join('&');
		fetchedArticles = await queryAPI(`/articles/overview/search?${queryString}`)
	} else {
		fetchedArticles = await queryAPI(`/articles/overview/newest`)
	}

	articles.update((currentArticles) => { currentArticles[feedName] = {"feedSpecs" : feedSpecs, "articles" : fetchedArticles}; return currentArticles});
}
