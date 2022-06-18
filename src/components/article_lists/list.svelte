<script>
	export let articleList

	import { modalState } from "../../shared/stores.js"
	import { getArticleContent } from "../../lib/articles/main.js"
	import { modifyCollection } from "../../lib/user/collections.js"

	import ArticleObject from "./articleObject.svelte"

	async function createArticleModal(event) {
		let articleContent = (await getArticleContent(event.detail.articleID))[0]
		$modalState = {"modalType" : "article", "modalContent" : articleContent}
		modifyCollection("Already Read", "extend", event.detail.articleID)

	}
</script>

{#if Array.isArray(articleList)}
	{#each articleList as article (article.id)}
		<ArticleObject on:modal={createArticleModal} article={article} />
		<hr>
	{:else}
		<div class="msg">
			<h1>Hmmm... Seems empty around here?</h1>
			<p>Maybe try another search, feed or collection to see if there's some articles there?</p>
		</div>
	{/each}
{:else}
<div class="msg">
	<h1>Whoops... an unknown error occurred??</h1>
	<p>Please try again later and should the error persists, then please contact your system administrator to handle the error.</p>
</div>
{/if}

<style lang="scss">
div.msg {
	margin: auto;
	width: min(80%, 90ch);

	height: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;

	h1, p {
		text-align: center;
	}

	h1 {
		@include font(1, 700, 2rem);
	}

	p {
		@include font(1, 200);
		margin-bottom: 2rem;
	}
}
</style>
