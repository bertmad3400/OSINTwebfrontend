<script>
	import { appConfig } from "../../shared/config.js"

	import SvelteMarkdown from 'svelte-markdown'

	import Modal from "./modal.svelte"
	import ReadLaterButton from "../shared/readLater.svelte"
	import AddToCollectionButton from "../shared/addToCollection.svelte"
	import GeneralInteractiveList from "../shared/interactiveListDropdown.svelte"

	export let articleObject

	const source = articleObject.formatted_content

	// https://github.com/bradvin/social-share-urls
	const shareLinks = {
			"LinkedIn" : `https://www.linkedin.com/sharing/share-offsite/?url=${articleObject.url}`,
			"Twitter" : `https://twitter.com/intent/tweet?url=${articleObject.url}&text=${articleObject.title}`,
			"Reddit" : `https://reddit.com/submit?url=${articleObject.url}&title=${articleObject.title}`
	}

	let potentialCopyTargets = {
		"Url" : async () => articleObject.url,
		"Raw Content" : async () => articleObject.content,
		"MD Content" : async () => articleObject.formatted_content,
		"Whole Article" : async () => {
			let wholeArticle = await fetch(`/articles/MD/single?ID=${encodeURIComponent(articleObject.id)}`)

			if (wholeArticle.ok) {
				return await wholeArticle.text()
			} else {
				return false
			}
		}
	}

	async function copyAttr(copyTarget) {
		if (copyTarget in potentialCopyTargets) {
			let copyContent = await potentialCopyTargets[copyTarget]()

			if (Boolean(copyContent)) {
				navigator.clipboard.writeText(copyContent)
				return true
			}
		}
		return false
	}

</script>

<Modal>
	<base target="_blank">
	<header>
		<nav>
			<ul>
				<li> <ReadLaterButton ID={articleObject.id} /> </li>
				<li> <AddToCollectionButton ID={articleObject.id}/> </li>
			</ul>
			<ul>
				<li> <GeneralInteractiveList processClick={(target) => window.open(shareLinks[target], "_blank")} listOptions={shareLinks} successMessage="Shared to SoMe." iconName="share"/></li>
				<li> <GeneralInteractiveList processClick={copyAttr} listOptions={potentialCopyTargets} successMessage="Copied to clipboard." iconName="clipboard"></GeneralInteractiveList></li>
				<li><a href={`${appConfig.rootUrl}/articles/MD/single?ID=${articleObject.id}`}><img src="/icons/file-earmark-arrow-down.svg" class="icon" aria-hidden="true"/></a></li>
			</ul>
		</nav>
	</header>

	<div class="article-content">
		<h1>{ articleObject.title }</h1>
		<h4>From { articleObject.source } - Written by { articleObject.author} - { articleObject.publish_date } - Read {articleObject.read_times} times.</h4>
		<img alt="Main Article" src="{ articleObject.image_url }">
		<h2>{ articleObject.description }</h2>
		<SvelteMarkdown {source} />
		<button on:click={() => window.open(articleObject.url, "_blank")}> Read article on website </button>
	</div>
</Modal>


<style lang="scss">
$header-height: 3rem;
$article-margins: max(calc((80vw - 90ch)/2), 5vw);

div.article-content {
	text-align: justify;

	height: calc(100% - $header-height);
	box-sizing: border-box;
	overflow-y: auto;

	padding: 3rem $article-margins 4rem $article-margins;

	:global(*) {
		max-width: 100%;
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
		:global(img) {
			margin-bottom: 0.3rem;

			& ~ :global(p), & ~ :global(strong), & ~ :global(em) {
				display: block;
				margin: 0 auto 0.2rem auto;

				width: max-content;

				font-style: italic;
				@include font(0.6, 200);
			}

			& ~ :global(br) {
				display: none;
			}

			& ~ :global(*):last-child {
				margin-bottom: 2rem;
			}
		}
	}

	:global(img) {
		border-radius: 1%;
		width: 100%;
	}

	:global(table) {
		width: 100%;
		background-color: $white;
		border-collapse: collapse;
		border: 2px solid $button-grey;

		color: #000000;

		:global(th), :global(td) {
			border: 2px solid $base-grey;
			padding: 0.1rem;

			@include font(1, 100, 0.7rem);

			:global(*) {
				@include font(1, 100, 0.7rem);
			}
		}

		:global(thead) {
			:global(th), :global(td) {
				border: 2px solid $button-grey;
			}

			background-color: $main-color-light;
		}

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

	border-bottom: 1px solid $button-grey;
	box-shadow: $base-grey 0px 1px 5px 0px;
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

				display: inline-block;

				cursor: pointer;

				:global(button), :global(a){
					@include button($header-height);
					box-sizing: border-box;

					padding: 0.7rem;

					:global(div) {
						left: 0;
						top: calc($header-height)
					}
				}

				a {
					display: inline-block;
					color: rgb(70, 70, 70);
				}
			}
		}
	}
}
</style>
