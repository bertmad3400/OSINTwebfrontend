import { loginState } from "../../shared/stores.js"
import { appConfig } from "../../shared/config.js";

export async function queryProtected(queryURL, method = "GET", body = null) {
	let headers

	headers = {
		credentials : "include",
		method : method,
		headers: {'Content-Type': 'application/json'},
		body : body ? JSON.stringify(body) : null
	}

	let queryResult = await fetch(`${appConfig.rootUrl}${queryURL}`, headers)

	if (queryResult.status == 401) {
		return {"status" : "not-auth", "content" : "User needs to be logged in to access this feature"}
	} else {
		loginState.update(currentState => {
			currentState.loggedIn = true
			return currentState
		})

		try {
			if (queryResult.ok) {
				return {"status" : "success", "content" : await queryResult.json()}
			} else {
				console.log("Error in query: ", queryResult)
				return {"status" : "failure", "content" : (await queryResult.json())["detail"] }
			}
		} catch {
			return {"status" : "failure", "content" : "An unexpected error occured, please try again"}
		}
	}
}

export async function changeOnlineState(URL, method, content, action, handleSuccessMethod) {
	let newState = await queryProtected(URL, method, content)

	if (newState.status === "success") {
		await handleSuccessMethod(newState.content)
	} else {
		console.log(`Failed to ${action}, with following error: `, newState.content)
	}

}
