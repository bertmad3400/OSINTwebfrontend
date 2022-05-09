export const appConfig = {
	"rootUrl" : "http://localhost:8000",
	"refreshRate" : 5, // Minimum time in minutes between refreshing of article lists
	"defaultFeeds" : {
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
			"highlight" : false
		},
		"Ransomware" : {
			"limit" : 200,
			"sortBy" : "publish_date",
			"sortOrder" : "desc",
			"searchTerm" : "ransomware",
			"highlight" : true
		}
	}
};
