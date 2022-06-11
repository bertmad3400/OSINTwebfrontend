<script>
	import Modal from "../modal.svelte"
	import General from "./general.svelte"
	import InputField from "./inputField.svelte"
	import Loader from "../../shared/loader.svelte"

	import { modalState, loginState } from "../../../shared/stores.js"
	import { appConfig } from "../../../shared/config.js"

	import { login as queryLogin, signup as querySignup } from "../../../lib/auth.js"
	import { getUserFeeds } from "../../../lib/user/feeds.js"
	import { getUserCollections } from "../../../lib/user/collections.js"

	import { onDestroy } from 'svelte';
	import { writable } from "svelte/store"

	const details = writable({})

	$: type = ( $modalState && "modalContent" in $modalState && Boolean($modalState.modalContent) && "type" in $modalState.modalContent ) ? $modalState.modalContent.type : false

	let missingDetailMsg = ""
	let loginReady = false
	let signupReady = false
	let loading = false

	const detailUnsubscribe = details.subscribe(detailValues => {

		if ( ! (Boolean(detailValues.username) && Boolean(detailValues.password)) ) {
			missingDetailMsg = "Please specify both password and username"
			loginReady = false
			signupReady = false
			return
		}
		loginReady = true

		if (type == "signup") {
			if ( !(detailValues.repeat_password === detailValues.password) ) {
				missingDetailMsg = "Passwords doesn't match"
				signupReady = false
				return
			}
			signupReady = true
		} else {
			signupReady = false
		}

		missingDetailMsg = false
	})

	async function handleResponse(response, successMsg) {
		if (response === true) {
			$modalState.modalContent = { "title" : "Success!", "desc" : successMsg, "type" : $modalState.modalContent.type == "signup" ? "login" : "result"}
		} else {
			try {
				let error = await response.json()
				$modalState.modalContent = {"title" : "Failure!", "desc" : error["detail"], "type" : $modalState.modalContent.type, "status" : "failure"}
			} catch {
				$modalState.modalContent = {"title" : "Whoops!", "desc" : "An unexpected error occured, please try again", "type" : $modalState.modalContent.type, "status" : "failure"}
			}
		}
	}

	async function login() {
		if (loginReady)	{
			loading = true

			let authResponse = await queryLogin($details.username, $details.password, $details.remember_me)

			await getUserFeeds()
			await getUserCollections()

			await handleResponse(authResponse, "You're now logged in!")

			loading = false
		}
	}

	async function signup() {
		if (signupReady) {
			loading = true
			let authResponse = await querySignup($details.username, $details.password)
			await handleResponse(authResponse, "You're now signed up! Login below to continue.")
			loading = false
		}
	}

	async function handleKeypress(keyName) {
		if (keyName == "Enter") {
			if (type == "signup") {
				signup()
			} else if (type == "login") {
				login()
			}
		}
	}

	onDestroy(detailUnsubscribe)
</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)}/>

<Modal height="clamp(60vh, 80ex, 80vh)" width="min(60ch, 80vw)">
	{#if loading}
		<Loader width="20%" container={true}/>
	{:else if type == "signup"}
		<General title="{$modalState.modalContent.title}" message="{$modalState.modalContent.desc}" topPadding="7vh">
			<form>
				{#each ["username", "password", "repeat_password"] as detailName}
					<InputField detailName="{detailName}" inputType="signup" userDetails="{details}"/>
				{/each}
				<hr>
				<InputField detailName="email" inputType="signup" userDetails="{details}" label="Email - (Optional)"/>
				<hr>
			</form>
			<button title="{missingDetailMsg ? missingDetailMsg : ""}" disabled="{!signupReady}" on:click={signup}>Sign Up</button>
			<p class="bottom">Already a user? <a href="#" on:click|preventDefault="{() => $modalState = structuredClone(appConfig.defaultOptions.modalStates.login) }">Login here</a></p>
		</General>
	{:else if type == "login"}
		<General title="{$modalState.modalContent.title}" message="{$modalState.modalContent.desc}" topPadding="10vh">
			<form>
				{#each ["username", "password"] as detailName}
					<InputField detailName="{detailName}" inputType="login" userDetails="{details}"/>
				{/each}

				<div class="details">
					<input bind:checked={$details.remember_me} class="switch" type="checkbox" id="remember" name="remember" value="True" unchecked>
					<label class="switch" for="remember">Remember Me</label>
					<a href="">Forgot password?</a>
				</div>
				<hr>
			</form>
			<button title="{missingDetailMsg ? missingDetailMsg : ""}" disabled="{!loginReady}" on:click={login}>Login</button>
			<p class="bottom">Not a user yet? <a href="#" on:click|preventDefault="{() => $modalState = structuredClone(appConfig.defaultOptions.modalStates.signup) }">Sign up here</a></p>
		</General>
	{:else if type == "result"}
		<General title="{$modalState.modalContent.title}" message="{$modalState.modalContent.desc}" topPadding="7vh">
		</General>
	{/if}
</Modal>

<style type="text/scss">
form {
	width: 100%;

	div.details {
		@include switch();

		margin-top: 0.4rem;

		display: flex;
		justify-content: space-between;
		align-items: center;

		a {
			@include font(1, 300);
		}
	}

}

p.bottom {
	margin: auto 0 1rem 0;

	&, a {
		font-size: 1rem;
		@include font(1, 100, 1rem);
	}
}

a {
	@include underline($main-color);

	text-decoration: none;
	width: fit-content;
	display: inline-block;
	color: $main-color !important;
}


hr {
	width: 100%;
	border-right : 0;
	border-left: 0;
	margin: 1rem 0 1rem 0;
}

button {
	border: none;
	border-radius: 0.4rem;

	margin-bottom: 2rem;


	@include font(0.6, 300, 0.9rem);

	height: 2.5rem;
	width: 100%;
	flex-shrink: 0;

	&:not(:disabled) {
		cursor: pointer;
		color: $white;
		background-color: hsl(135, 40%, 45%);

		transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
		&:hover {
			background-color: hsl(135, 50%, 55%);
		}
	}

	&:disabled {
		cursor: not-allowed;
	}
}


:global(div.input-container + div.input-container) {
	margin-top: 0.6rem;
}
</style>
