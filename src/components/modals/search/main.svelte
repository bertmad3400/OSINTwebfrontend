<script>
	import SourceSelect from "./sourceSelect.svelte"
	import SearchQuery from "./searchQuery.svelte"
	import Modal from "../modal.svelte"
	import Loader from "../../shared/loader.svelte"
	import MenuTypeTitle from "./title.svelte"

	import { appConfig } from "../../../shared/config.js"
	import { search } from "../../../lib/search.js"
	import { state, feeds, currentSearch as searchSpecs } from "../../../shared/stores.js"
	import { getArticleCategories } from "../../../lib/articles/main.js"

	import { onMount } from "svelte"
	import { slide } from 'svelte/transition';

	onMount(async () => {
		if (["feed", "search"].includes($state.selectedMenu.type)) {
			for (const feedCategory in $feeds) {
				if($state.selectedMenu.name in $feeds[feedCategory]) {
					let currentSearch = {...appConfig.defaultOptions.search, ...$feeds[feedCategory][$state.selectedMenu.name].searchQuery}

					if (!Boolean(currentSearch.sourceCategory)) { currentSearch.sourceCategory = [] }

					searchSpecs.set(currentSearch)
					return
				}
			}
		}

		searchSpecs.set(structuredClone(appConfig.defaultOptions.search))
	})

	let sources = getArticleCategories()

	// Variables used to control whether different segments are collapsed when screens width is small
	let openSourceSelect = true
	let openSearchQuery = true

	window.matchMedia('(min-width: 70rem)').addListener(() => {
		openSourceSelect = true
		openSearchQuery = true
	})

</script>


<Modal>
	{#await sources}
		<Loader height="20%" text={true}/>
	{:then sourceList}
		<div class="contentContainer">
			<div class="half">
				<MenuTypeTitle title="Select Sources" bind:open={openSourceSelect}/>
				{#if openSourceSelect}
					<div class="optionContainer" transition:slide|local>
							<SourceSelect searchSpecs={searchSpecs} sourceList={sourceList}/>
					</div>
				{/if}
			</div>

			<hr class="separator">

			<div class="half">
				<MenuTypeTitle title="Search Query" bind:open={openSearchQuery}/>
				{#if openSearchQuery}
					<div class="optionContainer seperateOptions" transition:slide|local>
						<SearchQuery searchSpecs={searchSpecs}/>
					</div>
				{/if}

				<hr class="separator">

				<button on:click={() => search($searchSpecs)}>Search content</button>
			</div>

		</div>
	{/await}
</Modal>

<style lang="scss">
$singlLaneMaxWidth: 70rem;

div.contentContainer {
	display: flex;

	padding: 2rem;
	box-sizing: border-box;
	overflow: auto;

	height: 100%;

	@media (max-width: $singlLaneMaxWidth) {
		flex-direction: column;
	}

}

div.half {
	display: flex;
	flex-direction: column;

	@media (min-width: $singlLaneMaxWidth) {
		width: 50%;

		&:first-of-type {
			border-right: 1px solid $button-grey;
			padding-right: 2rem;
		}

		&:last-of-type {
			padding-left: 2rem;
		}

		:global(button.collapse) {
			display: none;
		}
	}

	@media (max-width: $singlLaneMaxWidth) {
		width: 100%;
	}

	div.optionContainer {
		display: flex;
		flex-direction: column;
		min-height: 0;

		height: 100%;


		@media (min-width: $singlLaneMaxWidth) {
			&.seperateOptions {
				justify-content: space-between;
				overflow: auto;

				padding: 0.5rem;
			}
		}

	}
}

hr.separator {
	width: 100%;
	margin: 1rem 0 1.5rem 0;
	@media (min-width: $singlLaneMaxWidth) {
		display: none
	}
}

button {

	align-self: center;

	width: 60%;

	padding: 1.5rem;
	margin-top: 0.5rem;

	border-radius: 2px;
	border: 1px solid rgb(90, 90, 90, 0.2);
	background-color: transparent;

	cursor: pointer;
	transition: background-color 0.2s ease-in-out;

	&:hover {
		background-color: $button-grey;
	}

	@include font(0.5, 700);
	text-transform: uppercase;
}


</style>
