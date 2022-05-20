<script>
	export let articleList
	export let representation

	import { onMount } from "svelte"

	import LargeArticles from './large_article_list.svelte'
	import TitleArticles from './title_article_list.svelte'

	import { modalState } from "../../shared/stores.js"
	import { getArticleContent } from "../../lib/articles/main.js"

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

<svelte:component this={feedRepresentations[representation]} articleList={articleList} on:modal={createArticleModal}/>

<style type="text/scss">
article {
	display: flex;
	align-items: center;
	gap: 1rem;

	cursor: pointer;

	padding: 0.2rem;
	font-family: sans-serif;

	&:hover {
		background-color: rgba(0,0,0,.05);
	}

	&:last-child {
		margin-bottom: 8rem;
	}
}
</style>
