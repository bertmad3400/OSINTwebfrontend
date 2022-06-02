<script>
	import Icon from "../shared/icons.svelte"
	import { state } from "../shared/stores.js"
	import { search } from "../lib/search.js"

	function localSearch() {
		if ($state.localSearch) {
			search({"searchTerm" : $state.localSearch})
		}
	}
</script>

<form on:submit|preventDefault={localSearch} role="search" id="search-box">
	<label for="search-field"><Icon name="magnifying-glass"/></label>
	<input bind:value={$state.localSearch} id="search-field" type="text" placeholder="Search...">
	{#if $state.localSearch}<button on:click|preventDefault={() => $state.localSearch = ""}><Icon name="x"/></button>{/if}
</form>

<style type="text/scss">
#search-box {
	height: 4rem;
	border-bottom: 1px solid $button-grey;

	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: 1.5rem;

	padding-left: 1.5rem;

	label {
		opacity: 40%;
		cursor: text;
	}
	input {
		padding: 0rem;
		border: none;

		@include font(0.5, 500);
		height: 100%;
		flex-grow: 1;
		outline: 0;
	}

	button {
		@include button(0);

		height: 100%;
		aspect-ratio: 1 / 1;

		display: flex;
		justify-content: center;
		align-items: center;

		:global(svg) {
			opacity: 0.5;
			width: 35%;
			height: 35%;
		}
	}
}

</style>
