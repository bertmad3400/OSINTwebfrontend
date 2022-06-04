<script>
	import Modal from "../modal.svelte"
	import General from "./general.svelte"

	import InputField from "./inputField.svelte"

	import { writable } from "svelte/store"

	let details = writable({})
</script>

<Modal height="clamp(60vh, 80ex, 80vh)" width="min(60ch, 80vw)">
	{#if showSignup}
		<General title="Hi There!" message="Sign up below to start your own journey into the wonderful world of CTI">
			<form>
				{#each ["username", "password", "repeat_password"] as detailName}
					<InputField detailName="{detailName}" inputType="signup" userDetails="{details}"/>
				{/each}
				<hr>
				<InputField detailName="email" inputType="signup" userDetails="{details}" label="Email - (Optional)"/>
				<hr>
			</form>
			<button>Sign Up</button>
		</General>
	{:else}
		<General title="Welcome Back!" message="Log in down below to continue with your journey into the wonderful world of CTI">
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
			<button>Login</button>
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

	cursor: pointer;

	@include font(0.6, 300, 0.9rem);
	color: $white;

	height: 2.5rem;
	width: 100%;
	flex-shrink: 0;

	background-color: hsl(135, 40%, 45%);

	transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;

	&:hover {
		background-color: hsl(135, 50%, 55%);
	}
}


:global(div.input-container + div.input-container) {
	margin-top: 0.6rem;
}
</style>
