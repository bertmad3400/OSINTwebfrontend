export const appConfig = {
	"rootUrl" : "http://localhost:8000",
	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
	"defaultOptions" : {
		"search" : {
			"sourceCategory" : [],
			"sortBy" : "publish_date",
			"sortOrder" : "desc",
			"firstDate" : null,
			"lastDate" : null,
			"searchTerm" : null,
			"limit" : 100,
			"highlight" : false
		},
		"state" : {
				"selectedMenu" : {
					"name" : "News",
					"type" : "feed",
				},
				"representation" : "Large",
				"localSearch" : ""
		},
		"modalState" : {
				"modalType" : null,
				"modalContent" : null
		},
		"loginState" : {
				"loggedIn" : false,
				"userObject" : {}
		},
		"modalStates" : {
			"signup" : {
				"modalType" : "auth",
				"modalContent" : {
					"type" : "signup",
					"title" : "Hi There!",
					"desc" : "Sign up below to start your own journey into the wonderful world of CTI"
				}
			},
			"login" : {
				"modalType" : "auth",
				"modalContent" : {
					"type" : "login",
					"title" : "Welcome back!",
					"desc" : "Log in down below to continue with your journey into the wonderful world of CTI"
				}
			}
		}
	},
	"userOptions" : {
		"loggedIn" : {
			"Read Later" : { "icon" : "read-later", "type" : "collection" },
			"Configure Profile" : { "icon" : "gear", "type" : "userOptions" }
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
}

const deepFreeze = (obj) => {
	Object.keys(obj).forEach((property) => {
		if (
			typeof obj[property] === "object" &&
			!Object.isFrozen(obj[property])
		)
		deepFreeze(obj[property]);
	});
	return Object.freeze(obj);
};

deepFreeze(appConfig)
