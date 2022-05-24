<script>
	import SideBar from "./components/sidebar.svelte"
	import MainWindow from "./components/main_window.svelte"
	import ArticleModal from "./components/modals/article.svelte"
	import SearchModal from "./components/modals/search/main.svelte"


	import { appConfig } from "./shared/config.js"
	import { feeds, articles, modalState, currentSearch } from "./shared/stores.js"
	import { search } from "./lib/search.js"

	$feeds = appConfig.feeds

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
	{/if}
	<SideBar />
	<MainWindow />
</main>

<style type="text/scss">
main {
	display: flex;
	align-content: center;
	height: auto;
	min-height: 100%;
	overflow: hidden;
}
</style>
