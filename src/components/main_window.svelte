<script>
	import SearchField from "./search_fields.svelte"
	import ArticleListing from "./article_listings.svelte"
</script>

<section id="main-content">

	<SearchField />
	<ArticleListing />

</section>

<style type="text/scss">
#main-content {
	height: 100vh;
	width: calc(100vw - 18rem);
	display: flex;
	flex-direction: column;
}
</style>
