<script>
	export let articleObject
	let loading = false

	import Icon from "./icons.svelte"
	import Loader from "./loader.svelte"
	import Dropdown from "./dropdown.svelte"

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
			console.log(potentialCopyTargets[copyTarget])
			let copyContent = await potentialCopyTargets[copyTarget]()

			if (Boolean(copyContent)) {
				navigator.clipboard.writeText(copyContent)
				return true
			}
		}

		return false
	}
</script>

<button on:click|stopPropagation={() => loading = false}>
	<Icon name="copy"/>

	<Dropdown padding="0;">
		{#if !loading}
			<ul>
			{#each Object.keys(potentialCopyTargets) as copyTarget}
				<li on:click|stopPropagation={() => loading = copyAttr(copyTarget)}>{ copyTarget }</li>
			{/each}
			</ul>
		{:else}
			{#await loading}
				<Loader height="3rem"/>
			{:then loadingResult}
				<p>{ loadingResult ? "Copied to clipboard" : "Failed, try again" }</p>
			{/await}
		{/if}
	</Dropdown>
</button>

<style lang="scss">
button {
	border: none;
	background-color: transparent;

	display: flex;
	align-items: center;
	justify-content: center;

	position: relative;

	&:focus-within :global(div) {
		display: block;
	}

	ul {
		list-style-type: none;
		padding: 0;

		li {
			min-width: max-content;
			padding: 1rem;
			@include font(1, 200);

			transition: background-color 0.2s ease-in-out;

			&:hover {
				background-color: $base-grey;
			}

			&+li {
				margin-top: -0.7rem;
			}

		}
	}

	p {
		@include font(0.5, 600);
		min-width: 4rem;
		height: 2rem;
		padding: 1rem;

		transition: background-color 0.2s ease-in-out;

		&:hover {
			background-color: $base-grey;
		}
	}
}
</style>
