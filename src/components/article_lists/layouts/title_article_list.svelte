<script>

	import MarkArticleButton from "../../shared/markArticle.svelte"

	export let article
	export let time
	export let read = false

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<article class:read on:click={() =>  dispatch("modal", {"articleID" : article.id})}>
	<MarkArticleButton ID={article.id}/>
	<p class="source">{ article.source }</p>
	<div class="article-content">
		<h3>{ article.title }</h3>
		<p class="description">{ article.description }</p>
	</div>
	<time title="{ article.publish_date }">{ time }</time>
</article>

<style lang="scss">
article {
	:global(button) {
		@include button;
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
			transition: font-weight 0.2s;
		}
	}



	&:last-child {
		margin-bottom: 8rem;
	}

	&.read {
		h3 {
			font-weight: 200;
		}

		p {
			font-size: 0.8rem !important;
			opacity: 0.6;
		}
	}
}
</style>
