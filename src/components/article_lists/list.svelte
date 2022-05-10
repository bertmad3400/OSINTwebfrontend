<script>
	export let articleList
	export let representation

	import { onMount } from "svelte"

	import LargeArticles from './large_article_list.svelte'
	import TitleArticles from './title_article_list.svelte'

	const feedRepresentations = {
		"Large": LargeArticles,
		"Title-view": TitleArticles
	};
</script>

<svelte:component this={feedRepresentations[representation]} articleList={articleList}/>

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
