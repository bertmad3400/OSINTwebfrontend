import { readLater, collectionList, collectionArticles } from "../shared/stores.js"

import { queryProtected } from "./user.js"

async function updateCollectionStores(data) {
	if (data) {
		readLater.set(data["Read Later"])
		delete data["Read Later"]

		collectionList.set(data)
	}
}

export async function getUserCollections(collectionName = null) {
	let currentCollections = await queryProtected("/users/collections/list")

	await updateCollectionStores(currentCollections)

	if (collectionName) {
		await updateArticleListing(collectionArticles, collectionName, currentCollections[collectionName])
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

	let newCollectionState = await queryProtected(`/users/collections/modify/${collectionName}/${mod_action}${queryUrl}`, false, false)	

	await updateCollectionStores(newCollectionState)
}
