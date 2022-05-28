<script>
	export let article

	import LargeArticles from './layouts/large_article_list.svelte'
	import TitleArticles from './layouts/title_article_list.svelte'

	const feedRepresentations = {
		"Large": LargeArticles,
		"Title-view": TitleArticles
	};

	import { state, loginState, readLater } from "../../shared/stores.js"

	import { getTimespan } from "../../lib/date.js"

	$: currentReadLater = $loginState.loggedIn && $readLater && $readLater.includes(article.id)


</script>

<svelte:component this={feedRepresentations[$state.representation]} article={article} time={ getTimespan(article.publish_date) } readLater={currentReadLater} on:modal/>

<style type="text/scss">
</style>
