<script>
	import Modal from "../modal.svelte"
	import General from "./general.svelte"
	import InputField from "./inputField.svelte"

	import { modalState } from "../../../shared/stores.js"
	import { login as queryLogin, signup as querySignup } from "../../../lib/auth.js"

	import { onDestroy } from 'svelte';
	import { writable } from "svelte/store"

	const details = writable({})

	$: showSignup = $modalState && "modalContent" in $modalState && Boolean($modalState.modalContent) && "type" in $modalState.modalContent && $modalState.modalContent.type == "signup"

	let missingDetailMsg = ""
	let loginReady = false
	let signupReady = false
	let status = false

	const detailUnsubscribe = details.subscribe(detailValues => {

		if ( ! (Boolean(detailValues.username) && Boolean(detailValues.password)) ) {
			missingDetailMsg = "Please specify both password and username"
			loginReady = false
			signupReady = false
			return
		}
		loginReady = true

		if (showSignup) {
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


	async function formatAuthResponse(response, successMsg) {
		if (response === true) {
			return {"title" : "Success!", "desc" : successMsg}
		} else {
			try {
				let error = await userLogin.json()
				return {"title" : "Failure!", "desc" : error["detail"]}
			} catch {
				return {"title" : "Whoops!", "desc" : "An unexpected error occured, please try again"}
			}
		}
	}

	async function login() {
		if (loginReady)	{
			let authResponse = await queryLogin($details.username, $details.password)
			return await formatAuthResponse(authResponse, "You're now logged in!")
		}
	}

	async function signup() {
		if (signupReady) {
			let authResponse = await querySignup($details.username, $details.password)
			return await formatAuthResponse(authResponse, "You're now signed up!")
		}
	}

	onDestroy(detailUnsubscribe)
</script>

{#key showSignup}
<Modal height="clamp(60vh, 80ex, 80vh)" width="min(60ch, 80vw)">
	{#if status}
		{#await status}
			<Loader width="20%" container={true}/>
		{:then result}
			<General title="{result.title}" message="{result.desc}" topPadding="7vh">
				{#if showSignup}
					<p class="bottom"><a href="#" on:click|preventDefault="{() => $modalState = {"modalType" : "auth", "modalContent" : {"type" : "login"}}}">Login here</a></p>
				{/if}
			</General>
		{/await}
	{:else if showSignup}
		<General title="Hi There!" message="Sign up below to start your own journey into the wonderful world of CTI" topPadding="7vh">
			<form>
				{#each ["username", "password", "repeat_password"] as detailName}
					<InputField detailName="{detailName}" inputType="signup" userDetails="{details}"/>
				{/each}
				<hr>
				<InputField detailName="email" inputType="signup" userDetails="{details}" label="Email - (Optional)"/>
				<hr>
			</form>
			<button title="{missingDetailMsg ? missingDetailMsg : ""}" disabled="{!signupReady}" on:click={() => status = signup()}>Sign Up</button>
			<p class="bottom">Already a user? <a href="#" on:click|preventDefault="{() => $modalState = {"modalType" : "auth", "modalContent" : {"type" : "login"}}}">Login here</a></p>
		</General>
	{:else}
		<General title="Welcome Back!" message="Log in down below to continue with your journey into the wonderful world of CTI" topPadding="10vh">
			<form>
				{#each ["username", "password"] as detailName}
					<InputField detailName="{detailName}" inputType="login" userDetails="{details}"/>
				{/each}

				<div class="details">
					<input class="switch" type="checkbox" id="remember" name="remember" value="True" unchecked>
					<label class="switch" for="remember">Remember Me</label>
					<a href="">Forgot password?</a>
				</div>
				<hr>
			</form>
			<button title="{missingDetailMsg ? missingDetailMsg : ""}" disabled="{!loginReady}" on:click={() => status = login()}>Login</button>
			<p class="bottom">Not a user yet? <a href="#" on:click|preventDefault="{() => $modalState = {"modalType" : "auth", "modalContent" : {"type" : "signup"}}}">Sign up here</a></p>
		</General>
	{/if}
</Modal>
{/key}

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
