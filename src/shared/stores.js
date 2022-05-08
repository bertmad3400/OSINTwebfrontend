import { writable, derived } from 'svelte/store';

export const feeds = writable({
	"Log4J" : {
		"limit" : 200,
		"sortBy" : "publish_date",
		"sortOrder" : "desc",
		"searchTerm" : "log4j",
		"highlight" : true
	},
	"Bitcoin" : {
		"limit" : 50,
		"searchTerm" : "bitcoin",
		"highlight" : true
	},
	"Ransomware" : {
		"limit" : 200,
		"sortBy" : "publish_date",
		"sortOrder" : "desc",
		"searchTerm" : "ransomware",
		"highlight" : true
	}

});

export const articles = writable([]);
