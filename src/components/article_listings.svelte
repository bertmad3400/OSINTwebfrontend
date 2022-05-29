<script>
	import ArticleList from "./article_lists/list.svelte"
	import Icon from "../shared/icons.svelte"
	import RenderConfig from "./article_lists/configs/rendering.svelte"

	import { fade } from 'svelte/transition';
	import { derived } from 'svelte/store';

	import { feeds, articles, state, collectionArticles } from "../shared/stores.js"
	import { appConfig } from "../shared/config.js"
	import { refreshArticles } from "../lib/articles/main.js"
	import { getUserCollections } from "../lib/collections.js"
	import { onDestroy } from "svelte";

	$: showFeed = Boolean($articles) && $state.selectedMenu.type == "feed" && $state.selectedMenu.name in $articles

	const refreshArticleUnsubscribe = feeds.subscribe(currentFeeds => {
		refreshArticles(currentFeeds)
	});

	const currentArticle = derived([state, articles], async ([$state, $articles]) => {
		console.log("Re-calculating articleList")

		if ($state.selectedMenu.type == "collection") {
			await getUserCollections($state.selectedMenu.name)
		}

		if ($state.selectedMenu.type == "feed" || $state.selectedMenu.type == "collection" || $state.selectedMenu.type == "search"){
			let showFeed = Boolean($articles) && $state.selectedMenu.name in $articles

			console.log($articles, $state.selectedMenu)

			if (showFeed && $state.localSearch) {
				return $articles[$state.selectedMenu.name].articles.filter(article => Object.values(article).some(articleField => articleField.toLowerCase().includes($state.localSearch.toLowerCase())))
			} else if (showFeed) {
				return $articles[$state.selectedMenu.name].articles
			} else {
				return []
			}
		}
	})

	const downloadArticlesLink = derived(currentArticle, ($currentArticle) => {
		return $currentArticle.then((articleList) => { return `${appConfig.rootUrl}/articles/MD/multiple?${articleList.map(article => "IDs=" + article.id).join("&")}`})
	})

	onDestroy(refreshArticleUnsubscribe)


</script>

<section id="article-list" transition:fade>
	<header>
		<h2>{$state.selectedMenu.name} - {$state.selectedMenu.type.charAt(0).toUpperCase() + $state.selectedMenu.type.slice(1)}</h2>
		<section class="icons">
			{#await $downloadArticlesLink then link}
				<a href="{ link }"><Icon name="download"/></a>
			{/await}
			<button class="dropdown-options">
				<Icon name="three-dots"/>
				<RenderConfig />
			</button>
		</section>
	</header>
	<hr>

		{#await $currentArticle}
			<p> Loading articles...</p>
		{:then articleList}
			<section transition:fade>
				<ArticleList articleList={articleList} />
			</section>
		{/await}
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

		section.icons {

			* {
				cursor: pointer;
				padding: 0.3rem;

				background-color: transparent;
				transition: background-color .15s ease-in-out;

				display: inline-block;

				&:hover {
					background-color: rgba(0,0,0,.03);
				}

				:global(svg) {
					width: 1.4rem;
					height: 1.4rem;
					color: rgb(70, 70, 70);
				}
			}

			button.dropdown-options {
				border: none;

				position: relative;

				&:focus-within :global(div) {
					display: block;
				}

			}
		}
	}
}
</style>
