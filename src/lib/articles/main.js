import { appConfig } from "../../shared/config.js";

import { articles, collectionList, collectionArticles } from "../../shared/stores.js";
import { get } from "svelte/store";

export async function queryAPI(queryURL, defaultResponse = null) {
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
			updateArticleListing(articles, feedName, feedDetails["searchQuery"])
		}
	}
}

export async function updateArticleListing(articleList, sourceName, sourceSpecs) {
	let currentArticleList = get(articleList)

	if (sourceName in currentArticleList) {
		if ((Date.now() - currentArticleList[sourceName].time) / 60000 > appConfig.refreshRate || sourceSpecs != currentArticleList[sourceName]["sourceSpecs"]) {
			await fetchArticles(articleList, sourceName, sourceSpecs)
		}
	} else {
		await fetchArticles(articleList, sourceName, sourceSpecs)
	}
}

async function fetchArticles(articleContainer, sourceName, sourceSpecs = null){
	let fetchedArticles;

	if (typeof sourceSpecs === "object" && !Array.isArray(sourceSpecs) && sourceSpecs !== null) {
		const queryString = Object.keys(sourceSpecs)
			.filter(key => sourceSpecs[key])
			.map(key => `${key}=` + (	Array.isArray(sourceSpecs[key])
										? sourceSpecs[key].map(value => encodeURIComponent(value)).join(`&${key}=`)
										: encodeURIComponent(sourceSpecs[key])
									)
			).join('&');

		fetchedArticles = await queryAPI(`/articles/overview/search?${queryString}`)
	} else if (Array.isArray(sourceSpecs)) {
		if (sourceSpecs.length > 0) {
			// Using slice to limit the amount of articles requested, since there's an upper limit to the length of an URL
			const IDQuery = `IDs=${sourceSpecs.slice(0, 100).map(ID => encodeURIComponent(ID)).join("&IDs=")}`
			fetchedArticles = await queryAPI(`/articles/overview/search?${IDQuery}`)
		} else {
			fetchedArticles = []
		}
	} else {
		fetchedArticles = await queryAPI(`/articles/overview/newest`)
	}

	articleContainer.update((currentArticles) => { currentArticles[sourceName] = {"sourceSpecs" : sourceSpecs, "articles" : fetchedArticles, "time" : Date.now()}; return currentArticles});
}
