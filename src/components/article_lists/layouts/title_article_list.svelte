<script>

	import MarkArticleButton from "../../shared/markArticle.svelte"

	export let article
	export let time

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<article on:click={() =>  dispatch("modal", {"articleID" : article.id})}>
	<MarkArticleButton ID={article.id}/>
	<p class="source">{ article.source }</p>
	<div class="article-content">
		<h3>{ article.title }</h3>
		<p class="description">{ article.description }</p>
	</div>
	<time>{ time }</time>
</article>

<style lang="scss">
article {
	:global(button) {
		@include button;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	display: flex;
	align-items: center;
	gap: 1rem;

	cursor: pointer;

	padding: 0.2rem;
	font-family: sans-serif;

	&:hover {
		background-color: $base-grey;
	}

	* {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: rgb(125, 125, 125);
	}

	p.source {
		flex-shrink: 0;
		width: 6%;
		@include font(0.6, 300);
	}

	time {
		flex-shrink: 0;
		@include font(0.6, 300, 0.6rem);
		margin-left: auto;
	}

	.article-content {
		flex-shrink: 1;

		p, h3 {
			display: inline;
		}

		p {
			font-size: 0.9rem;
		}

		h3 {
			@include font(1, 600, 1rem);
		}
	}



	&:last-child {
		margin-bottom: 8rem;
	}
}
</style>
