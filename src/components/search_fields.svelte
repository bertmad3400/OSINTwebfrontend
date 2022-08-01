<script>
	import { state } from "../shared/stores.js"
	import { search } from "../lib/search.js"

	function localSearch() {
		if ($state.localSearch) {
			search({"searchTerm" : $state.localSearch})
		}
	}
</script>

<form on:submit|preventDefault={localSearch} role="search" id="search-box">
	<label for="search-field"><img src="/icons/search.svg" class="icon" aria-hidden="true"></label>
	<input bind:value={$state.localSearch} id="search-field" type="text" placeholder="Search...">
	{#if $state.localSearch}<button type="button" on:click|preventDefault={() => $state.localSearch = ""}><img src="/icons/x.svg" class="icon" aria-hidden="true"></button>{/if}
</form>

<style lang="scss">
#search-box {
	height: 4rem;
	border-bottom: 1px solid hsl(0deg, 0%, 92%);

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

		img.icon {
			width: 35%;
			height: 35%;
		}
	}
}

</style>
