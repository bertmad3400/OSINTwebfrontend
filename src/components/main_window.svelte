<script>
	import SearchField from "./search_fields.svelte"
	import ArticleListing from "./article_listings.svelte"

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
	width: calc(100vw - 18rem);
	display: flex;
	flex-direction: column;
}
</style>
