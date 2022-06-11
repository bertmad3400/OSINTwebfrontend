<script>
	import Icon from "./shared/icons.svelte";
	import Menu from "./sidebar/menu.svelte"
	import { feeds, state, modalState, loginState, collectionList, currentSearch } from "../shared/stores.js";
	import { appConfig } from "../shared/config.js"

	import { showSearchModal } from "../lib/state.js"
	import { logout } from "../lib/auth.js"

	import { createFeed, getUserFeeds, getFeedNames } from "../lib/user/feeds.js"
	import { getUserCollections, createCollection } from "../lib/user/collections.js"

	import { onDestroy } from "svelte"

	async function createFeedFromSearch(feedName) {
		let feedSpecs = $currentSearch
		feedSpecs.feed_name = feedName

		await createFeed(feedSpecs)
		$modalState = {"modalType" : null, "modalContent" : null}
		$state = {...$state, "selectedMenu" : {"name" : feedName, "type" : "feed"}, "localSearch" : ""}
	}

	async function addFeed() {
		await getUserFeeds()

		if ($loginState.loggedIn) {
			if($state.selectedMenu.type == "search") {
				$modalState = {"modalType" : "getName", "modalContent" : {"userAction" : "New feed name", "action" : createFeedFromSearch, "existingNames" : await getFeedNames($feeds)}}
			} else {
				showSearchModal()
			}
		} else {
			$modalState = {"modalType" : "auth", "modalContent" : {"type" : "login", "title" : "Login here", "desc" : "Login here or signup with the link down below to create custom feeds."}}
		}
	}

	async function addCollection() {
		getUserCollections()

		if ($loginState.loggedIn) {
				$modalState = {"modalType" : "getName", "modalContent" : {"userAction" : "New collection name", "action" : async (feedName) => { await createCollection(feedName); $modalState = {"modalType" : null, "modalContent" : null}; }, "existingNames" : Object.keys($collectionList)}}
		} else {
			$modalState = {"modalType" : "auth", "modalContent" : {"type" : "login", "title" : "Login here", "desc" : "Login here or signup with the link down below to create collections."}}
		}
	}

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

	<button class="long-button" class:selected={$state.selectedMenu.type === "search"} on:click={showSearchModal}> <Icon name="magnifying-glass"/> <span> {$state.selectedMenu.type === "search" ? "Exploring Content" : "Explore Content"} </span> </button>

	<nav>
		<Menu menuOptions={ $feeds.mainFeeds } />
		<Menu title="feeds" menuOptions={$feeds.userFeeds} >
			<li	on:click={addFeed} class:click-able="{$state.selectedMenu.type == "search"}"><Icon name="plus"/><span>New Feed</span></li>
		</Menu>

		{#if $loginState.loggedIn }
			<Menu title="Collections" menuOptions={userCollections} menuType="collection">
				<li on:click={addCollection} class="click-able"><Icon name="plus"/><span>New Collection</span></li>
			</Menu>
			<Menu title="User" menuOptions={appConfig.userOptions.loggedIn}>
				<li	on:click={logout} class="click-able"><Icon name="logout"/><span>Logout</span></li>
			</Menu>
		{:else}
			<Menu title="User">
				<li on:click={() => $modalState = structuredClone(appConfig.defaultOptions.modalStates.login) } class="click-able"><Icon name="logout"/><span>Login</span></li>
			</Menu>
		{/if}

	</nav>

</aside>

<style type="text/scss">
li {
	opacity: 0.7;

	&.click-able:hover {
		opacity: 1;
		border-left: 5px solid $main-color;
		padding-left: calc(2rem - 5px);

		:global(*) {
			color: $main-color !important;
		}
	}
}

#logo-space {
	height: 4rem;
	padding-left: 1rem;
	overflow: hide;
	display: flex;
	align-items: center;

	border-bottom: 1px solid hsl(0deg, 0%, 92%);

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

	background: $base-grey;
	box-sizing: border-box;

	border-right: 1px solid $base-grey;
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
		border-color: rgba(90, 90, 90, 0.4);
		span {
			color: rgba(0, 0, 0, 0.6)
		}
		:global(svg) {
			opacity: 0.85;
			border-color: rgba(90, 90, 90, 0.5)
		}
	}

	&.selected {
		border-color: hsla(135, 60%, 45%, 0.6);

		span {
			color: hsla(135, 60%, 45%, 0.6);
		}
		:global(svg) {
			opacity: 0.85;
			border-color: rgb(135, 60%, 45%, 0.7);
		}

		color: $main-color;
	}



}
</style>
