import { writable } from 'svelte/store';
import { appConfig } from "./config.js"

export const feeds = writable({});

export const articles = writable({})

export const feedUpdates = writable({})

export const state = writable({
				"selectedMenu" : {
					"name" : "News",
					"type" : "feed",
				},
				"representation" : "Large",
				"localSearch" : ""
			})

export const modalState = writable({
				"modalType" : null,
				"modalContent" : null
			})

export const loginState = writable({
				"loggedIn" : false,
				"userObject" : {}
			})

export const currentSearch = writable({
			"sourceCategory" : [],
			"sortBy" : "publish_date",
			"sortOrder" : "desc",
			"firstDate" : null,
			"lastDate" : null,
			"searchTerm" : null,
			"limit" : appConfig.defaultLimit,
			"highlight" : false
	})
