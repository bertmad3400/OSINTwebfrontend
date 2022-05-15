export const appConfig = {
	"rootUrl" : "http://localhost:8000",
	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
	"userOptions" : {
		"Read Later" : { "icon" : "read-later" },
		"Configure Profile" : { "icon" : "gear" },
		"Logout" : { "icon" : "logout" }
	},
	"feeds" : {
		"mainFeeds" : {
			"News" : { "searchQuery" : null, "icon" : "logo" },
			"Today" : { "searchQuery" : null, "icon" : "calendar" }
		},
		"userFeeds" : {
			"Log4J" : {
				"searchQuery" : {
					"limit" : 200,
					"sortBy" : "publish_date",
					"sortOrder" : "desc",
					"searchTerm" : "log4j",
					"highlight" : true
				}
			},
			"Bitcoin" : {
				"searchQuery" : {
					"limit" : 50,
					"searchTerm" : "bitcoin",
					"highlight" : false
				}
			},
			"Ransomware" : {
				"searchQuery" : {
					"limit" : 200,
					"sortBy" : "publish_date",
					"sortOrder" : "desc",
					"searchTerm" : "ransomware",
					"highlight" : true
				}
			}
		}
	}
};
