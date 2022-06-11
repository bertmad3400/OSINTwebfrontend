import { collectionList, collectionArticles } from "../../shared/stores.js"
import { updateArticleListing } from "../articles/main.js"

import { queryProtected } from "./main.js"

async function updateCollectionStores(data) {
	if (data) {
		await collectionList.set(data)
	}
}

export async function getUserCollections(collectionName = null) {
	let currentCollections = await queryProtected("/users/collections/list")

	if (currentCollections.status === "success") {
		await updateCollectionStores(currentCollections.content)

		if (collectionName && collectionName in currentCollections.content) {
			await updateArticleListing(collectionArticles, collectionName, currentCollections.content[collectionName])
		}
	} else {
		console.log("Failed to get user collections, with following error: ", currentCollections.content)
	}
}

export async function modifyCollection(collectionName, mod_action, IDs) {
	let queryUrl

	if (Array.isArray(IDs)) {
		queryUrl = "?IDs=" + IDs.join("&IDs=")
	} else if (IDs) {
		queryUrl = `?IDs=${IDs}`
	} else {
		return
	}

	let newCollectionState = await queryProtected(`/users/collections/modify/${collectionName}/${mod_action}${queryUrl}`, false)	

	if (newCollectionState.status === "success") {
		await updateCollectionStores(newCollectionState.content)
	} else {
		console.log(`Failed to modify "${collectionName}" collection with following error: `, newCollectionState.content)
	}
}

export async function createCollection(collectionName) {
	let newCollectionState = await queryProtected(`/users/collections/create/${collectionName}/`, false)

	if (newCollectionState.status === "success") {
		await updateCollectionStores(newCollectionState.content)
	} else {
		console.log(`Failed to add "${collectionName}" collection with following error: `, newCollectionState.content)
	}
}
