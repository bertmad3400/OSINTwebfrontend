import { writable } from 'svelte/store';

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
