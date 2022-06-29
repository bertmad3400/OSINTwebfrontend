<script>
	export let article
	export let time
	export let read = false

	import MarkArticleButton from "../../shared/markArticle.svelte"
	import AddToCollectionButton from "../../shared/addToCollection.svelte"

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<article class:read on:click={() =>  dispatch("modal", {"articleID" : article.id})}>
	<div class="image-container" on:click|stopPropagation>
		<div class="button-container">
			<MarkArticleButton ID={article.id}/>
			<AddToCollectionButton ID={article.id}/>
		</div>
		<img alt="Article overview" src='{ article.image_url }'>
	</div>
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

	.image-container {
		position: relative;

		height: 8rem;
		width: 8rem;
		flex-shrink: 0;

		border-radius: 5%;

		background-color: hsl(0, 0%, 0%);

		cursor: not-allowed;

		img {
			border-radius: 5%;

			height: 100%;
			width: 100%;

			object-fit: cover;
			overflow: hidden;

			flex-shrink: 0;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

			transition: opacity 0.3s;
		}

		.button-container {
			position: absolute;
			display: flex;

			width: 100%;

			left: 0;
			top: 50%;

			transform: translateY(-50%);

			z-index: 1;

			:global(button) {
				cursor: pointer;

				position: relative;
				opacity: 0;
				transition: opacity 0.5s;

				height: 100%;
				width: 50%;
				padding: 0;

				:global(svg) {
					height: 50%;
					width: 50%;
				}

				&:not(.filled) {
					:global(svg) {
						color: #ffffff;
					}
				}

				&:last-child {
					border-left: 1px solid $white;
				}
			}
		}

		&:hover {
			img {
				opacity: 0.4;
			}

			.button-container {
				background-color: rgba(0,0,0,0.2);
				box-shadow: rgba(0, 0, 0, 0.8) 0px 22px 70px 4px;

				:global(button) {
					opacity: 1 !important;
				}
			}
		}
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
