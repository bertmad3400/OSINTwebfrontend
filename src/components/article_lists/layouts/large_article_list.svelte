<script>
	export let article
	export let time
	export let read = false

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<article class:read on:click={() =>  dispatch("modal", {"articleID" : article.id})}>
	<img alt="Article overview" src='{ article.image_url }'>
	<div class="article-content">
		<div class="article-details">
			<p class="source">{ article.source }</p>
			<time>{ time }</time>
		</div>
		<h3>{ article.title }</h3>
		<p class="description">{ article.description }</p>
	</div>
</article>

<style lang="scss">
article {
	display: flex;
	align-items: center;
	gap: 2rem;

	cursor: pointer;

	padding: 1rem 2rem 1rem 2rem;

	font-family: sans-serif;

	&:hover {
		background-color: $base-grey;
	}

	img {
		border-radius: 5%;

		height: 8rem;
		width: 8rem;

		object-fit: cover;
		overflow: hidden;

		flex-shrink: 0;
		box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	}


	.article-content {
		width: 100%;
		display: flex;
		flex-direction: column;

		.article-details {
			display: flex;
			justify-content: space-between;

			p, time {
				display: inline;
				@include font(0.6, 300)
			}
		}

		p {
			color: rgb(125, 125, 125);
			font-size: 0.9rem;
			@include truncate(1);
		}

		h3 {
			@include font(1, 600, 1.3rem);
			@include truncate(1);
			transition: font-weight 0.2s;
		}
	}

	margin: 1rem 0rem 1rem 0rem;

	&:last-child {
		margin-bottom: 8rem;
	}

	&.read {
		h3 {
			font-weight: 100 !important;
		}

		p {
			opacity: 0.7;
		}
	}

}
</style>
