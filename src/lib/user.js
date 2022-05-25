import { loginState } from "../shared/stores.js"
import { appConfig } from "../shared/config.js";

async function queryProtected(queryURL, defaultResponse = false, body = null) {
	let headers

	if (body) {
		headers = {
			credentials : "include",
			method : "POST",
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify(body)
		}
	} else {
		headers = {
			credentials : "include"
		}
	}

	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`, headers)

	if (queryResult.ok) {
		loginState.update(currentState => {
			currentState.loggedIn = true
			return currentState
		})

		return await queryResult.json()

	} else if (queryResult.status == 401) {
		loginState.set({
			"loggedIn" : false,
			"userObject" : {}
		})

		return defaultResponse
	}
}
