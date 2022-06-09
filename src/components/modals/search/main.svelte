<script>
	import SourceSelect from "./sourceSelect.svelte"
	import SearchQuery from "./searchQuery.svelte"
	import Modal from "../modal.svelte"
	import Loader from "../../shared/loader.svelte"

	import { appConfig } from "../../../shared/config.js"
	import { search } from "../../../lib/search.js"
	import { state, feeds, currentSearch as searchSpecs } from "../../../shared/stores.js"
	import { getArticleCategories } from "../../../lib/articles/main.js"

	import { onMount } from "svelte"

	onMount(async () => {
		if (["feed", "search"].includes($state.selectedMenu.type)) {
			for (const feedCategory in $feeds) {
				if($state.selectedMenu.name in $feeds[feedCategory]) {
					console.log($searchSpecs, $feeds[feedCategory][$state.selectedMenu.name].searchQuery)
					searchSpecs.set({...appConfig.defaultOptions.search, ...$feeds[feedCategory][$state.selectedMenu.name].searchQuery})
					return
				}
			}
		}

		searchSpecs.set(appConfig.defaultOptions.search)
	})

	let sources = getArticleCategories()

</script>


<Modal>
	{#await sources}
		<Loader height="20%" container={true}/>
	{:then sourceList}

		<div class="contentContainer">
			<div class="optionContainer">
				<SourceSelect searchSpecs={searchSpecs} sourceList={sourceList}/>
			</div>

			<hr class="separator">

			<div class="optionContainer seperateOptions">
				<SearchQuery searchSpecs={searchSpecs}/>
				<button on:click={() => search($searchSpecs)}>Search content</button>
			</div>
		</div>
	{/await}
</Modal>

<style type="text/scss">
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

div.optionContainer {

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

		&.seperateOptions {
			justify-content: space-between;
		}
	}

	@media (max-width: $singlLaneMaxWidth) {
		width: 100%;
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

	@include button;

	align-self: center;
	justify-self: center;

	width: 60%;
	height: 4rem;

	padding: 1.5rem;

	border-radius: 2px;
	border: 1px solid rgb(90, 90, 90, 0.2);

	@include font(0.5, 700);
	text-transform: uppercase;
}


</style>
