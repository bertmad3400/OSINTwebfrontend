import { modalState, feeds, state, loginState, currentSearch, collectionList, collectionArticles } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"

// Used for creating article modal
import { getArticleContent } from "./articles/main.js"
import { modifyCollection } from "./user/collections.js"

const storeOverview = {
	"feeds" : {"store" : feeds, "defaultValue" : structuredClone(appConfig.feeds)},
	"state" : {"store" : state, "defaultValue" : structuredClone(appConfig.defaultOptions.state)},
	"modalState" : {"store" : modalState, "defaultValue" : structuredClone(appConfig.defaultOptions.modalState)},
	"loginState" : {"store" : loginState, "defaultValue" : structuredClone(appConfig.defaultOptions.loginState)},
	"currentSearch" : {"store" : currentSearch, "defaultValue" : structuredClone(appConfig.defaultOptions.search)},
	"collectionList" : {"store" : collectionList, "defaultValue" : null},
	"collectionArticles" : {"store" : collectionArticles, "defaultValue" : {}},
}

export function showSearchModal() {
	modalState.set({"modalType" : "search", "modalContent" : null})
	document.activeElement.blur()
}

export async function createArticleModal(articleID) {
	let articleContent = (await getArticleContent(articleID))[0]
	modalState.set({"modalType" : "article", "modalContent" : articleContent})
	modifyCollection("Already Read", "extend", articleID)
}

export async function resetState() {
	for (const storeDetails of Object.values(storeOverview)) {
		storeDetails.store.set(storeDetails.defaultValue)
	}
}

export async function syncStateToLocalStorage(includeStores = false) {
	let unsubscribeFunctions = []

	for (const storeName of Object.keys(storeOverview)) {
		if (Array.isArray(includeStores) && includeStores.includes(storeName)) {
			unsubscribeFunctions.push(
				storeOverview[storeName].store.subscribe((value) => localStorage.setItem(storeName, JSON.stringify(value)))
			)
		}
	}

	return () => { unsubscribeFunctions.forEach(funcName => funcName())}
}

export async function syncLocalStorageToState(includeStores = false) {
	for (const storeName of Object.keys(storeOverview)) {
		if (Array.isArray(includeStores) && includeStores.includes(storeName)) {
			const currentValue = localStorage.getItem(storeName)

			if (Boolean(currentValue)) {
				try {
					storeOverview[storeName].store.set(JSON.parse(currentValue))
				} catch (e) {
					console.log(`Failed to read state details regarding "${storeName}", with the following value and error. Clearing it for now.`, currentValue, e)
					localStorage.removeItem(storeName)
				}
			}
		}
	}
}
