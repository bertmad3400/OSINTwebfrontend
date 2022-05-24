<script>
	import SideBar from "./components/sidebar.svelte"
	import MainWindow from "./components/main_window.svelte"
	import ArticleModal from "./components/modals/article.svelte"
	import SearchModal from "./components/modals/search/main.svelte"


	import { appConfig } from "./shared/config.js"
	import { feeds, articles, modalState } from "./shared/stores.js"

	$feeds = appConfig.feeds

</script>

<svelte:window on:keydown={(e) => { if (e.key == "Escape") {$modalState = {"modalType" : null, "modalContent" : null};} ; }}/>

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
