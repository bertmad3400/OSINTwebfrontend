<script>
	import ArticleList from "./article_lists/list.svelte"
	import Icon from "../shared/icons.svelte"
	import RenderConfig from "./article_lists/configs/rendering.svelte"

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
		let showFeed = Boolean($articles) && $state.selectedMenu.type == "feed" && $state.selectedMenu.name in $articles

		if (showFeed && $state.localSearch) {
			return $articles[$state.selectedMenu.name].articles.filter(article => Object.values(article).some(articleField => articleField.toLowerCase().includes($state.localSearch.toLowerCase())))
		} else if (showFeed) {
			return $articles[$state.selectedMenu.name].articles
		}
	})

	onDestroy(refreshArticleUnsubscribe)


</script>

{#if $state.selectedMenu.type == "feed"}
<section id="article-list" transition:fade>
	<header>
		<h2>{$state.selectedMenu.name}</h2>
		<button class="dropdown-options">
			<Icon name="three-dots"/>
			<RenderConfig />
		</button>
	</header>
	<hr>

		{#if $currentArticle}
			{#key $currentArticle}
			<section transition:fade>
				<ArticleList articleList={$currentArticle} representation={$state.representation} />
			</section>
			{/key}
		{/if}
</section>
{/if}

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

		button.dropdown-options {
			border: none;
			background-color: transparent;

			position: relative;
			padding: 0.3rem;

			transition: background-color .15s ease-in-out;

			&:hover {
				background-color: rgba(0,0,0,.03);
			}

			&:focus-within :global(div) {
				display: block;
			}

			:global(svg) {
				width: 1.4rem;
				height: 1.4rem;
				color: rgb(70, 70, 70);


				cursor: pointer;

			}
		}
	}
}
</style>
