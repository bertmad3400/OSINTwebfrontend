<script>
	import { appConfig } from "../../shared/config.js"

	import SvelteMarkdown from 'svelte-markdown'

	import Modal from "./modal.svelte"
	import Icon from "../../shared/icons.svelte"

	export let articleContent
	
	let source = articleContent.formatted_content

</script>

<Modal>
	<header>
		<nav>
			<ul>
				{#each ["read-later", "favorite"] as iconName}
					<li> <Icon name={iconName}/> </li>
				{/each}
			</ul>
			<ul>
				{#each ["linkedin", "copy"] as iconName}
					<li> <Icon name={iconName}/> </li>
				{/each}
				<li><a href={`${appConfig.rootUrl}/articles/MD/single?ID=${articleContent.id}`}><Icon name="download"/></a></li>
			</ul>
		</nav>
	</header>

	<div class="article-content">
		<h1>{ articleContent.title }</h1>
		<h4>From { articleContent.source } - Written by { articleContent.author} - { articleContent.publish_date }</h4>
		<img alt="Article Image" src="{ articleContent.image_url }">
		<h2>{ articleContent.description }</h2>
		<SvelteMarkdown {source} />	
		<button on:click={() => window.open(articleContent.url, "_blank")}> Read article on website </button>
	</div>
</Modal>


<style type="text/scss">
$header-height: 3rem;
$article-margins: max(calc((80vw - 90ch)/2), 5vw);

div.article-content {
	text-align: justify;

	height: calc(100% - $header-height);
	box-sizing: border-box;
	overflow-y: auto;

	padding: 3rem $article-margins 4rem $article-margins;

	:global(*) {
		width: 100%;
		margin-bottom: 1.5rem;

		@include font(1, 300, 1rem);
		color: rgb(125, 125, 125);
	}

	:global(h1) {
		@include font(0.8, $size: 2.3rem);
		line-height: 2.1rem;
	}

	:global(h4) {
		@include font(0.5, 300);
	}

	:global(h2) {
		@include font(0.7, 800, 1.4rem);
	}

	:global(p) {

	}

	:global(img) {
		border-radius: 1%;
	}

	button {
		@include button(4rem);
		width: 100%;
		border-radius: 2px;
		border: 1px solid rgb(90, 90, 90, 0.2);


		@include font(0.5, 700);
		text-transform: uppercase;

	}
}

header {
	height: $header-height;

	border-bottom: 1px solid #efefef;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
	nav {

		margin-left: $article-margins;
		margin-right: $article-margins;

		display: flex;
		justify-content: space-between;

		ul {
			padding: 0;

			li {
				height: $header-height;
				width: $header-height;
				padding: calc($header-height * 0.2);
				box-sizing: border-box;

				display: inline-block;

				cursor: pointer;

				&:hover {
					background-color: rgba(0,0,0,.05);
				}

				:global(svg) {
					opacity: 0.4;
					height: 100%;
					width: 100%;
				}

				a {
					color: rgb(70, 70, 70);
				}
			}
		}
	}
}
</style>
