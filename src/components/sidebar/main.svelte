<script>
	import Logo from "../shared/logo.svelte";
	import Menu from "./menu.svelte"

	import { feeds, state, modalState, loginState, collectionList, currentSearch } from "../../shared/stores.js";
	import { appConfig } from "../../shared/config.js"

	import { showSearchModal } from "../../lib/state.js"
	import { logout } from "../../lib/auth.js"

	import { createFeed, getUserFeeds, getFeedNames, removeFeed } from "../../lib/user/feeds.js"
	import { getUserCollections, createCollection, removeCollection } from "../../lib/user/collections.js"

	import { onDestroy } from "svelte"
	import { fly, slide } from "svelte/transition"

	let open = true

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
			userCollections = Object.fromEntries(Object.entries(collectionList).filter(([key, value]) => !appConfig.permCollections.includes(key)))
		} else {
			userCollections = {}
		}
	})

	onDestroy(collectionListUnsubscribed)

	window.matchMedia('(min-width: 70rem)').addListener(() => {
			open = true
	})

	window.matchMedia('(max-width: 60rem)').addListener(() => {
			open = false
	})

</script>

<svelte:window on:keydown={(e) => {if (e.key === "ArrowLeft") {open = false} else if (e.key === "ArrowRight") {open = true} }}/>

{#if open}
<aside id="navbar" transition:fly|local={{ x: -50, duration: 150}}>
	<div id="logo-space"><Logo/><h2>OSINTer</h2></div>

	<button class="long-button" class:selected={$state.selectedMenu.type === "search"} on:click={showSearchModal}> <img src="/icons/search.svg" class="icon" aria-hidden="true"> <span> {$state.selectedMenu.type === "search" ? "Exploring Content" : "Explore Content"} </span> </button>

	<nav>
		<Menu menuOptions={ $feeds.mainFeeds } />
		<Menu title="feeds" menuOptions={$feeds.userFeeds} removeFunction="{removeFeed}">
			<li	on:click={addFeed} class:click-able="{$state.selectedMenu.type == "search"}"><img src="/icons/plus.svg" class="icon category-icon" aria-hidden="true"><span>New Feed</span></li>
		</Menu>

		{#if $loginState.loggedIn }
			<Menu title="Collections" menuOptions={userCollections} menuType="collection" removeFunction="{removeCollection}">
				<li on:click={addCollection} class="click-able"><img src="/icons/plus.svg" class="category-icon icon" aria-hidden="true"><span>New Collection</span></li>
			</Menu>
			<Menu title="User" menuOptions={appConfig.userOptions.loggedIn}>
				<li	on:click={logout} class="click-able"><img src="/icons/box-arrow-left.svg" class="icon category-icon" aria-hidden="true"><span>Logout</span></li>
			</Menu>
		{:else}
			<Menu title="User">
				<li on:click={() => $modalState = structuredClone(appConfig.defaultOptions.modalStates.login) } class="click-able"><img src="/icons/box-arrow-right.svg" class="icon category-icon" aria-hidden="true"><span>Login</span></li>
			</Menu>
		{/if}

		<Menu title="about" closed={true}>
			<a href="blog/"><li class="click-able"><img src="/icons/journal-text.svg" class="icon category-icon" aria-hidden="true"><span>Blog</span></li></a>
		</Menu>

	</nav>

</aside>
{/if}

<button class="control-open {open ? 'open' : ''}" on:click={() => {document.activeElement.blur(); open = !open;}}><img src="/icons/arrow-down-right-square-fill.svg" class="icon" aria-hidden="true"></button>

<style lang="scss">
button.control-open {
	$radius: 4rem;
	$margin: 1rem;

	border-radius: $radius $radius $radius 0;

	width: $radius;
	height: $radius;

	position: absolute;
	z-index: 1;

	bottom: $margin;
	left: $margin;

	display: flex;
	align-items: center;
	justify-content: center;

	box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

	background-color: $base-grey;
	border: none;

	cursor: pointer;

	transition: border-radius 0.5s;

	img.icon {
		width: 40%;
		height: 40%;

		opacity: 0.4;

		transition: opacity 0.4s, filter 0.4s, transform 0.35s;
	}

	&:hover {
		img.icon {
			opacity: 1;
			filter: $main-color-filter;
		}
	}

	&:focus {
		border-radius: calc($radius * 0.2) !important;
	}

	&.open {
		border-radius: 0 $radius $radius $radius ;

		left: 13rem;

		img.icon {
			transform: rotate(90deg);
		}

		background-color: $button-grey;
	}
}

li {
	opacity: 0.7;

	&.click-able:hover {
		opacity: 1;
		border-left: 5px solid $main-color;
		padding-left: calc(2rem - 5px);

		:global(*) {
			color: $main-color !important;
		}

		img.icon {
			filter: $main-color-filter;
		}


	}
}

#logo-space {
	height: 4rem;
	padding: 0 1.5rem 0 1.5rem;
	overflow: hide;
	display: flex;
	align-items: center;

	border-bottom: 1px solid hsl(0deg, 0%, 92%);

	cursor: pointer;

	opacity: 0.6;
	transition: opacity 0.5s;

	:global(svg) {
		height: 2rem;
		width: 2rem;

	}

	h2 {
		margin-left: 1rem;
		font-weight: 1000;
		font-family: sans-serif;
		font-size: 1.5rem;
		color: $main-color-light;
	}

	&:hover {
		opacity: 1;
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

	img.icon {
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
		img.icon {
			opacity: 0.85;
			border-color: rgba(90, 90, 90, 0.5)
		}
	}

	&.selected {
		border-color: $main-color-light;

		span {
			color: $main-color-light;
		}

		img.icon {
			opacity: 0.85;
			border-color: $main-color-light;
			filter: $main-color-filter;
		}

		color: $main-color;
	}



}
</style>
