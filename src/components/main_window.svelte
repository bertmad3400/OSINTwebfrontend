<script>
	import SearchField from "./search_fields.svelte"
	import ArticleListing from "./article_lists/main.svelte"

	import { state } from "../shared/stores.js"
</script>

<section id="main-content">

{#if ["feed", "search", "collection"].includes($state.selectedMenu.type)}
	<SearchField />
	<ArticleListing />
{/if}

</section>

<style lang="scss">
#main-content {
	height: 100vh;
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex-grow: 1;
}
</style>
