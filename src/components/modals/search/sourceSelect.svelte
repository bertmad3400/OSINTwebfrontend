<script>
	import { getArticleCategories } from "../../../lib/articles/main.js"

	import Icon from "../../../shared/icons.svelte"

	export let searchSpecs
	let sourceSearch = ""

	let sources = getArticleCategories()
</script>

{#await sources}
	<p> waiting... </p>
{:then sourceList}
	<h1> Select Sources </h1>

	<header class="options">
		<form on:submit|preventDefault role="search" id="source-search">
			<label for="source-search"><Icon name="magnifying-glass"/></label>
			<input bind:value={sourceSearch} id="source-search" type="text" placeholder="Search sources...">
		</form>
		<p class:clickable={$searchSpecs.sourceCategory.length > 0} on:click="{() => $searchSpecs.sourceCategory = []}">Remove selections ({$searchSpecs.sourceCategory.length})</p>
		<p class:clickable={Object.keys(sourceList).length != $searchSpecs.sourceCategory.length} on:click="{() => $searchSpecs.sourceCategory = Object.keys(sourceList)}">Select all</p>
	</header>

	<form on:submit|preventDefault>
	{#each Object.entries(sourceList) as [profileName, sourceDetails]}
		<input bind:group={$searchSpecs.sourceCategory} type="checkbox" id="{profileName}-checkbox" name="{profileName}" value="{profileName}">

		{#if sourceSearch.length == 0 || sourceDetails.name.toLowerCase().includes(sourceSearch)}
		<label for="{profileName}-checkbox">
			<img src="{ sourceDetails.image}"/>
			<div class="sourceDetails">
				<h3>{ sourceDetails.name }</h3>
				<a href="{ sourceDetails.url }" target="_blank" rel="noopener noreferrer">{ sourceDetails.url.replace("https://", "") }</a>
			</div>

			<div class="selectIcon">
				{#if $searchSpecs.sourceCategory.indexOf(profileName) > -1}
					<Icon name="tick"/>
				{:else}
					<Icon name="plus"/>
				{/if}
			</div>
		</label>
		{/if}
	{/each}
	</form>

{/await}

<style type="text/scss">
h1 {
	@include font(0.8, 600, 1.3rem);
	margin-bottom: 1rem;
}


header.options{
	display: flex;
	margin-bottom: 2rem;

	#source-search {
		height: 2rem;
		min-width: 30%;
		border: 1px solid #efefef;

		flex-grow: 1;
		display: inline-flex;


		label {
			opacity: 30%;
			margin: 0.6rem;
			cursor: text;

			display: flex;
			align-items: center;

			:global(svg) {
				width: 0.8rem;
				height: 0.8rem;
			}
		}

		input {
			padding: 0rem;
			border: none;

			@include font(0.5, 500);
			flex-grow: 1;
			outline: 0;
		}
	}

	p {
		margin: 0.5rem 0 0 2rem;
		display: inline;

		@include font(0.5, 600, 1rem);

		cursor: not-allowed;

		&.clickable {
			color: hsl(135, 60%, 45%);
			cursor: pointer;
		}
	}
}


form {
	overflow: auto;
	padding-right: 1rem;

	label {

		cursor: pointer;
		margin-bottom: 0.3rem;

		/*border: 1px solid #efefef;
		border-radius: 0.5rem;*/

		display: flex;


		img {
			grid-row: span 2;
			border-radius: 5%;

			height: 3rem;
			width: 3rem;

			margin: 1rem;

			object-fit: contain;
			overflow: hidden;

			flex-shrink: 0;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
			background-color: hsl(0, 0%, 100%)
		}

		div.sourceDetails {

			flex-grow: 1;

			display: flex;
			flex-direction: column;
			justify-content: center;

			h3 {
				@include font(1, 600, 1.3rem);
				line-height: 1.5rem;
				margin-top: 0.25rem;
			}

			a {

				width: fit-content;

				@include font(0.6, 300, 0.8rem);
				text-decoration: none;

				&:hover {
					color: rgb(0, 0, 0, 0.8);
				}
			}
		}

		div.selectIcon {
			height: 2rem;
			width: 2rem;
			margin: 1.5rem 1rem 1.5rem 1rem;

			border-radius: 50%;
			border: 1px solid #efefef;

			overflow: hidden;

			display: flex;
			justify-content: center;
			align-items: center;

			:global(svg) {
				height: 100%;
				width: 100%;

				opacity: 40%;
			}
		}

		&:hover {
			background-color: hsl(0, 0%, 95%);
		}
	}

	input {
		display: none;
	}

	input:checked + label {
		background-color: hsl(135, 50%, 95%);
		div.selectIcon {
			border-color: hsl(135, 60%, 45%);
			background-color: hsl(135, 60%, 45%);

			:global(svg) {
				opacity: 100%;
				color: hsl(0, 0%, 100%);

				height: 60%;
				width: 60%;
			}
		}
	}
}

</style>
