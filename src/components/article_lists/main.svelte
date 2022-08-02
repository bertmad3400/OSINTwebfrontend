<script>
	import ArticleList from "../article_lists/list.svelte"
	import RenderConfig from "../article_lists/configs/rendering.svelte"
	import Loader from "../shared/loader.svelte"

	import { fade } from 'svelte/transition';
	import { derived } from 'svelte/store';

	import { feeds, articles, state, collectionArticles, collectionList } from "../../shared/stores.js"
	import { appConfig } from "../../shared/config.js"
	import { refreshArticles } from "../../lib/articles/main.js"
	import { getUserCollections, updateCollectionStores } from "../../lib/user/collections.js"
	import { changeOnlineState } from "../../lib/user/main.js"
	import { onDestroy } from "svelte";

	$: pageTitle = `${$state.selectedMenu.name} - ${$state.selectedMenu.type.charAt(0).toUpperCase() + $state.selectedMenu.type.slice(1)}`

	const refreshArticleUnsubscribe = feeds.subscribe(currentFeeds => {
		refreshArticles(currentFeeds)
	});

	const currentArticle = derived([state, articles], async ([$state, $articles]) => {
		let articleSource

		if ($state.selectedMenu.type == "collection") {
			await getUserCollections($state.selectedMenu.name)
			articleSource = $collectionArticles
		} else {
			articleSource = $articles
		}

		if (["feed", "collection", "search"].includes($state.selectedMenu.type)){
			let showFeed = Boolean(articleSource) && $state.selectedMenu.name in articleSource

			if (showFeed && $state.localSearch) {
				return articleSource[$state.selectedMenu.name].articles.filter(article => Object.values(article).some(articleField => articleField.toLowerCase().includes($state.localSearch.toLowerCase())))
			} else if (showFeed) {
				return articleSource[$state.selectedMenu.name].articles
			} else {
				return []
			}
		}
	})

	const downloadArticlesLink = derived(currentArticle, ($currentArticle) => {
		return $currentArticle.then((articleList) => {
			if (Boolean(articleList)) {
				return `${appConfig.rootUrl}/articles/MD/multiple?${articleList.map(article => "IDs=" + article.id).join("&")}`
			} else {
				return ""
			}
		})
	})

	const allArticlesRead = derived([currentArticle, collectionList], async ([$currentArticle, $collectionList]) => {
		if (!Boolean($collectionList) || ! "Already Read" in $collectionList) {
			return false
		}

		return $currentArticle.then((articleList) => {
			if (Boolean(articleList)) {
				for (const article of articleList) {
					if (!$collectionList["Already Read"].includes(article.id)) {
						return false
					}
				}
				return true
			} else {
				return false
			}
		})
	})

	onDestroy(refreshArticleUnsubscribe)

</script>

<section id="article-list" transition:fade>
	<header>
		{#await $allArticlesRead}
			<h2>{ pageTitle }</h2>
		{:then read}
			<h2 class:read>{ pageTitle }</h2>
		{/await}

		<section class="icons">
			{#await $downloadArticlesLink then link}
				<a href="{ link }" title="Download all articles listed below"><img src="/icons/file-arrow-down.svg" class="icon" aria-hidden="true"></a>
			{/await}
			{#if $state.selectedMenu.type === "collection"}
				<button class="config-options" on:click={() => changeOnlineState(`/users/collections/clear/${encodeURIComponent($state.selectedMenu.name)}`, "POST", null, `clear ${$state.selectedMenu.name} collection`, (collectionData) => { updateCollectionStores(collectionData); $state.selectedMenu.name = $state.selectedMenu.name} )}>
					<Icon name="trashcan"/>
				</button>
			{/if}
			<button class="config-options">
				<Icon name="three-dots"/>
				<button title="Remove all articles from the current collection" class="config-options" on:click={() => changeOnlineState(`/users/collections/clear/${encodeURIComponent($state.selectedMenu.name)}`, "POST", null, `clear ${$state.selectedMenu.name} collection`, (collectionData) => { updateCollectionStores(collectionData); $state.selectedMenu.name = $state.selectedMenu.name} )}>
					<img src="/icons/trash3.svg" class="icon" aria-hidden="true">
				</button>
			{/if}
			<button title="Change appearance the articles listed below" class="config-options">
				<img src="/icons/three-dots-vertical.svg" class="icon" aria-hidden="true">
				<RenderConfig />
			</button>
		</section>
	</header>
	<hr>

		{#await $currentArticle}
			<Loader height="20%" text={true} />
		{:then articleList}
			<ArticleList articleList={articleList} />
		{/await}
</section>

<style lang="scss">
section#article-list {
	padding: 4rem 6rem 4rem 6rem;

	height: 100%;
	overflow-y: scroll;

	border-right: 1px solid $button-grey;

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

			&.read {
				font-weight: 100 !important;
			}
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

				img.icon {
					width: 1.4rem;
					height: 1.4rem;
					color: rgb(70, 70, 70);
				}
			}

			button.config-options {
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
