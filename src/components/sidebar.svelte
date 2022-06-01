<script>
	import Icon from "../shared/icons.svelte";
	import Menu from "./sidebar/menu.svelte"
	import { feeds, state, modalState, loginState, collectionList } from "../shared/stores.js";
	import { appConfig } from "../shared/config.js"

	import { showSearchModal } from "../lib/state.js"
	import { logout } from "../lib/auth.js"

	import { onDestroy } from "svelte"

	let userCollections = {}

	const collectionListUnsubscribed = collectionList.subscribe(collectionList => {
		if (collectionList && Object.keys(collectionList).length > 1) {
			userCollections = Object.fromEntries(Object.entries(collectionList).filter(([key, value]) => key !== "Read Later"))
		}
	})

	onDestroy(collectionListUnsubscribed)
</script>

<aside id="navbar">
	<div id="logo-space"><img alt="OSINTer logo" src="https://logos-download.com/wp-content/uploads/2019/07/Feedly_Logo-700x231.png"/></div>

	<button class="long-button" on:click={showSearchModal}> <Icon name="magnifying-glass"/> <span> Explore Content </span> </button>

	<nav>
		<Menu menuOptions={ $feeds.mainFeeds } />
		<Menu title="feeds" menuOptions={$feeds.userFeeds} >
			<li> <Icon name="plus"/> <span style="opacity: 0.8">Add feed</span></li>
		</Menu>

		{#if $loginState.loggedIn }
			{#if $collectionList }
				<Menu title="Collections" menuOptions={$collectionList} menuType="collection">
					<li> <Icon name="plus"/> <span style="opacity: 0.8">Add collection</span></li>
				</Menu>
			{/if}
			<Menu title="User" menuOptions={appConfig.userOptions.loggedIn}>
				<li	on:click={logout} class="click-able"><Icon name="logout"/><span>Logout</span></li>
			</Menu>
		{:else}
			<Menu title="User">
				<li class="click-able"><Icon name="logout"/><span>Login</span></li>
			</Menu>
		{/if}

	</nav>

</aside>

<style type="text/scss">
li {
	opacity: 0.7;

	&.click-able:hover {
		opacity: 1;
		border-left: 5px solid #2bb24c;
		padding-left: calc(2rem - 5px);

		:global(*) {
			color: #2bb24c !important;
		}
	}
}

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
