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


{#each articleList as article (article.id)}
	<ArticleObject on:modal={createArticleModal} article={article} />
	<hr>
{/each}

<style lang="scss">
</style>
