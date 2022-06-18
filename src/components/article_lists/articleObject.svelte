<script>
	export let article
	$: read = Boolean($collectionList) && "Already Read" in $collectionList && $collectionList["Already Read"].includes(article.id)

	import LargeArticles from './layouts/large_article_list.svelte'
	import TitleArticles from './layouts/title_article_list.svelte'

	const feedRepresentations = {
		"Large": LargeArticles,
		"Title-view": TitleArticles
	};

	import { state, loginState, collectionList } from "../../shared/stores.js"

	import { getTimespan } from "../../lib/date.js"
</script>

<svelte:component this={feedRepresentations[$state.representation]} article={article} time={ getTimespan(article.publish_date) } {read} on:modal/>

<style lang="scss">
</style>
