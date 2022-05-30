export const appConfig = {
	"rootUrl" : "http://localhost:8000",
	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
	"defaultSearch" : {
		"sourceCategory" : [],
		"sortBy" : "publish_date",
		"sortOrder" : "desc",
		"firstDate" : null,
		"lastDate" : null,
		"searchTerm" : null,
		"limit" : 100,
		"highlight" : false
	},
	"userOptions" : {
		"loggedOut" : {
			"Login" : { "icon" : "logout" }
		},
		"loggedIn" : {
			"Read Later" : { "icon" : "read-later", "type" : "collection" },
			"Configure Profile" : { "icon" : "gear", "type" : "userOptions" },
			"Logout" : { "icon" : "logout", "type" : "action" }
		}
	},
	"feeds" : {
		"mainFeeds" : {
			"News" : { "searchQuery" : { "limit" : 3}, "type" : "feed", "icon" : "logo" },
			"Today" : { "searchQuery" : null, "type" : "feed", "icon" : "calendar" }
		},
		"userFeeds" : {
			"Log4J" : {
				"searchQuery" : {
					"limit" : 200,
					"sortBy" : "publish_date",
					"sortOrder" : "desc",
					"searchTerm" : "log4j",
					"highlight" : true
				},
				"type" : "feed"
			},
			"Bitcoin" : {
				"searchQuery" : {
					"limit" : 50,
					"searchTerm" : "bitcoin",
					"highlight" : false
				},
				"type" : "feed"
			},
			"Ransomware" : {
				"searchQuery" : {
					"limit" : 200,
					"sortBy" : "publish_date",
					"sortOrder" : "desc",
					"searchTerm" : "ransomware",
					"highlight" : true
				},
				"type" : "feed"
			}
		}
	}
};
