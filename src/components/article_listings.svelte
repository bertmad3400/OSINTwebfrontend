<script>
	import ArticleList from "./article_lists/list.svelte"
	import Icon from "../shared/icons.svelte"

	import { fade } from 'svelte/transition';
	import { derived } from 'svelte/store';

	import { feeds, articles, state } from "../shared/stores.js"
	import { refreshArticles } from "../shared/articles.js"
	import { onDestroy } from "svelte";

	$: showFeed = Boolean($articles) && $state.selectedMenu.type == "feed" && $state.selectedMenu.name in $articles

	const refreshArticleUnsubscribe = feeds.subscribe(currentFeeds => {
		refreshArticles(currentFeeds)
	});

	const currentArticle = derived([state, articles], ([$state, $articles]) => {
		console.log("Re-calculating articleList")
		if (showFeed && $state.localSearch) {
			return $articles[$state.selectedMenu.name].articles.filter(article => Object.values(article).some(articleFields => articleFields.includes($state.localSearch)))
		} else if (showFeed) {
			return $articles[$state.selectedMenu.name].articles
		}
	})

	onDestroy(refreshArticleUnsubscribe)


</script>

<section id="article-list">
	<header>
		<h2>{$state.selectedMenu.name}</h2>
		<Icon name="three-dots"/>
	</header>
	<hr>

	{#if showFeed && $currentArticle}
		{#key $currentArticle}
		<section transition:fade>
			<ArticleList articleList={$currentArticle} representation={$state.representation} />
		</section>
		{/key}
	{/if}

</section>

<style type="text/scss">
section#article-list {
	padding: 4rem 6rem 4rem 6rem;

	height: 100%;
	overflow-y: scroll;

	border-right: 1px solid #efefef;

	header {

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		margin-bottom: 5rem;

		h2 {
			@include font(0.7, 700, 2.5rem);
			margin-bottom: 0.2rem;
			line-height: 1.7rem;
		}

		:global(svg) {
			width: 1.4rem;
			height: 1.4rem;
			color: rgb(70, 70, 70);

			transition: background-color .2s ease-in-out;

			cursor: pointer;

			&:hover {
				background-color: rgba(0,0,0,.03);
			}
		}

	}
}
</style>
