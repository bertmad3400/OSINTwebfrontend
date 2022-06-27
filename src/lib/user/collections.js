import { collectionList, collectionArticles } from "../../shared/stores.js"
import { updateArticleListing } from "../articles/main.js"

import { queryProtected, changeOnlineState } from "./main.js"

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
		queryUrl = "?IDs=" + IDs.map(ID => encodeURIComponent(ID)).join("&IDs=")
	} else if (IDs) {
		queryUrl = `?IDs=${encodeURIComponent(IDs)}`
	} else {
		return
	}

	await changeOnlineState(`/users/collections/modify/${encodeURIComponent(collectionName)}/${encodeURIComponent(mod_action)}${queryUrl}`, "POST", null, `modify "${collectionName}" collection`, updateCollectionStores)
}

export async function createCollection(collectionName) {
	await changeOnlineState(`/users/collections/create/${encodeURIComponent(collectionName)}`, "POST", null, `create "${collectionName}" collection`, updateCollectionStores)
}

export async function removeCollection(collectionName) {
	await changeOnlineState(`/users/collections/remove/${encodeURIComponent(collectionName)}`, "DELETE", null, `remove "${collectionName}" collection`, updateCollectionStores)
}
