import { loginState } from "../shared/stores.js"
import { appConfig } from "../shared/config.js";

export async function login(username, password) {
	let headers = {
		credentials : "include",
		method : "POST",
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded"
		},
		body : new URLSearchParams({
			"username" : username,
			"password" : password
		})
	}

	let queryResult = await fetch(`${appConfig.rootUrl}/auth/login`, headers)

	if (queryResult.ok) {
		loginState.set({
			"loggedIn" : true,
			"userObject" : await queryResult.json()
		})

		return true
	} else {
		return (await queryResult.json())["detail"]
	}
}
