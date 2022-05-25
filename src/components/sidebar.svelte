<script>
	import Icon from "../shared/icons.svelte";
	import Menu from "./sidebar/menu.svelte"
	import { feeds, state, modalState, loginState } from "../shared/stores.js";
	import { appConfig } from "../shared/config.js"
</script>

<aside id="navbar">
	<div id="logo-space"><img alt="OSINTer logo" src="https://logos-download.com/wp-content/uploads/2019/07/Feedly_Logo-700x231.png"/></div>

	<button class="long-button" on:click={() => { $modalState.modalType = "search"; document.activeElement.blur(); } }> <Icon name="magnifying-glass"/> <span> Explore Content </span> </button>

	<nav>
		<Menu menuOptions={ $feeds.mainFeeds } menuType="feed" />
		<Menu title="feeds" menuOptions={$feeds.userFeeds} menuType="feed">
			<li> <Icon name="plus"/> <span style="opacity: 0.8">Add feed</span></li>
		</Menu>

		{#if $loginState.loggedIn }
			<Menu title="User" menuOptions={appConfig.userOptions.loggedIn} menuType="userOptions" />
		{:else}
			<Menu title="User" menuOptions={appConfig.userOptions.loggedOut} menuType="userOptions" />
		{/if}

	</nav>

</aside>

<style type="text/scss">
#logo-space {
	height: 4rem;
	padding-left: 1rem;
	overflow: hide;
	display: flex;
	align-items: center;

	border-bottom: 1px solid #efefef;

	img {
		height: 50%;
	}
}

#navbar {
	flex-shrink: 0;
	width: 18rem;
	height: auto;
	height: 100vh;
	overflow-y: auto;

	background: hsl(210, 13%, 97%);
	box-sizing: border-box;

	border-right: 1px solid #efefef;
	nav {
		color: rgb(51, 51, 51);
		font-family: sans-serif;
	}
}

.long-button {
	display: flex;
	align-items: center;

	margin: 1rem;
	margin-bottom: 2rem;
	width: calc(100% - 2rem);
	height: 2.5rem;

	background-repeat: no-repeat;
	overflow: hidden;
	outline: none;

	cursor: pointer;

	border: 1px solid rgb(90, 90, 90, 0.2);
	transition: border-color .2s ease-in-out;

	border-radius: 2px;

	background-color: transparent;

	span {
		flex-grow: 1;
		@include font(0.2);
		transition: color .2s ease-in-out;
	}

	:global(svg) {
		border-right: 1px solid rgb(90, 90, 90, 0.3);

		height: 100%;
		width: 1rem;
		padding: 0.8rem;

		opacity: 0.45;
		transition: border-color .2s ease-in-out, opacity .2s ease-in-out;
	}

	&:hover {
		border-color: rgb(90, 90, 90, 0.4);
		span {
			@include font(0.6);
		}
		:global(svg) {
			opacity: 0.85;
			border-color: rgb(90, 90, 90, 0.5)
		}
	}


}
</style>
