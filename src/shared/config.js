export const appConfig = {
	"rootUrl" : "",
	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
	"permCollections" : ["Read Later", "Already Read"],
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
			"Read Later" : { "icon" : "bookmarks", "type" : "collection"},
			"Already Read" : { "icon" : "bookmarks", "type" : "collection"}//,
			//"Configure Profile" : { "icon" : "gear", "type" : "userOptions" }
		}
	},
	"feeds" : {
		"mainFeeds" : {
			"News" : { "searchQuery" : null, "type" : "feed"},
			"Today" : { "searchQuery" : {"lastDate" : (new Date()).toISOString(), "firstDate" : (new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).toISOString()}, "type" : "feed", "icon" : "calendar3" }
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
					"highlight" : false
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
