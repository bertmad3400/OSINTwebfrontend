<script>
	import SideBar from "./components/sidebar/main.svelte"
	import MainWindow from "./components/main_window.svelte"

	import ArticleModal from "./components/modals/article.svelte"
	import SearchModal from "./components/modals/search/main.svelte"
	import AuthModal from "./components/modals/auth/main.svelte"
	import GetNameModal from "./components/modals/getName.svelte"

	import { onMount, onDestroy } from "svelte"

	import { appConfig } from "./shared/config.js"
	import { feeds, articles, modalState, currentSearch } from "./shared/stores.js"
	import { search } from "./lib/search.js"
	import { getUserFeeds } from "./lib/user/feeds.js"
	import { getUserCollections } from "./lib/user/collections.js"
	import { syncLocalStorageToState, syncStateToLocalStorage } from "./lib/state.js"

	// List of name of stores that is saved in local storage for preserving state across reloads
	let savedStateStores = ["state", "modalState", "currentSearch"]

	let localStorageSyncUnsubscribe

	onMount(async () => {

		await syncLocalStorageToState()
		localStorageSyncUnsubscribe = await syncStateToLocalStorage()

		getUserFeeds()
		getUserCollections()
	})

	onDestroy(localStorageSyncUnsubscribe)

	function handleKeypress(keyName) {
		switch (keyName) {
			case "Escape":
				$modalState = {"modalType" : null, "modalContent" : null}
				break

			case "Enter":
				if ($modalState.modalType == "search") {
					search($currentSearch)
				}

				break
		}
	}

</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)}/>

<main>
	{#if $modalState.modalType == "article" && $modalState.modalContent}
		<ArticleModal articleContent={$modalState.modalContent} />
	{:else if $modalState.modalType == "search"}
		<SearchModal />
	{:else if $modalState.modalType == "auth"}
		<AuthModal />
	{:else if $modalState.modalType == "getName"}
		<GetNameModal />
	{/if}
	<SideBar />
	<MainWindow />
</main>

<style lang="scss">
main {
	display: flex;
	align-content: center;
	height: auto;
	min-height: 100%;
	overflow: hidden;
}
</style>
