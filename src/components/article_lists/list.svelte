<script>
	export let articleList
	export let representation

	import { onMount } from "svelte"

	import LargeArticles from './large_article_list.svelte'
	import TitleArticles from './title_article_list.svelte'

	import { modalState } from "../../shared/stores.js"
	import { getArticleContent } from "../../lib/articles/main.js"

	import { getTimespan } from "../../lib/date.js"

	const feedRepresentations = {
		"Large": LargeArticles,
		"Title-view": TitleArticles
	};

	async function createArticleModal(event) {
		const articleQuery = await getArticleContent(event.detail.articleID)
		if (articleQuery.ok) {
			let articleContent = (await articleQuery.json())[0]
			$modalState = {"modalType" : "article", "modalContent" : articleContent}
		}
	}
</script>


{#each articleList as article (article.id)}
	<svelte:component this={feedRepresentations[representation]} article={article} time={ getTimespan(article.publish_date) } on:modal={createArticleModal}/>
	<hr>
{/each}

<style type="text/scss">
</style>
