import { loginState } from "../shared/stores.js"
import { appConfig } from "../shared/config.js"
import { queryProtected } from "./user/main.js"
import { resetState } from "./state.js"

function getHeaders(username, password, params = {}) {
	return {
		credentials : "include",
		method : "POST",
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded"
		},
		body : new URLSearchParams({
			"username" : username,
			"password" : password,
			...params
		})
	}
}

export async function signup(username, password) {
	let queryResult = await fetch(`${appConfig.rootUrl}/auth/signup`, getHeaders(username, password))
	return queryResult.ok ? true : queryResult
}

export async function login(username, password, remember_me = false) {

	let queryResult = await fetch(`${appConfig.rootUrl}/auth/login?remember_me=${remember_me}`, getHeaders(username, password))

	if (queryResult.ok) {
		loginState.set({
			"loggedIn" : true,
			"userObject" : await queryResult.json()
		})

		return true
	} else {
		return queryResult
	}
}


export async function logout() {
	await queryProtected("/auth/logout", "POST")
	resetState()
}
