<script>
	import SourceSelect from "./sourceSelect.svelte"
	import Modal from "../modal.svelte"
	import Params from "./general.svelte"

	import { appConfig } from "../../../shared/config.js"
	import { search } from "../../../lib/search.js"
	import { state, feeds, currentSearch as searchSpecs } from "../../../shared/stores.js"

	import { onMount } from "svelte"

	const inputFields = {
		"timespan" : [
			{ "readable" : "First Date", "name" : "firstDate" },
			{ "readable" : "Last Date", "name" : "lastDate" }
		],
		"sorting" : [
			{
				"readable" : "Sort Order",
				"name" : "sortOrder",
				"options" : [
					[ "desc", "Descending"],
					[ "asc", "Ascending"]
				]
			},
			{
				"readable" : "Sort By",
				"name" : "sortBy",
				"options" : [
					["publish_date", "Publish Date"],
					["read_times", "Times read"],
					["source", "Source"],
					["author", "Author"],
					["url", "URL"],
					["inserted_at", "Time of scraping"]
				]
			}
		]
	}

	onMount(async () => {
		if (["feed", "search"].includes($state.selectedMenu.type)) {
			for (const feedCategory in $feeds) {
				if($state.selectedMenu.name in $feeds[feedCategory]) {
					console.log($searchSpecs, $feeds[feedCategory][$state.selectedMenu.name].searchQuery)
					searchSpecs.set({...appConfig.defaultSearch, ...$feeds[feedCategory][$state.selectedMenu.name].searchQuery})
					return
				}
			}
		}

		searchSpecs.set(appConfig.defaultSearch)
	})

</script>


<Modal>
	<div class="contentContainer">
		<div class="optionSelectContainer">
			<SourceSelect searchSpecs={searchSpecs}/>
		</div>

		<Params inputTitle="Timespan" inputDesc="Enter wanted date interval. Only articles published within this interval will be shown.">
			{#each inputFields.timespan as inputDesc}
				<div class="inputContainer">
					<label for="{inputDesc.name}">{inputDesc.readable}</label>
					<input bind:value={$searchSpecs[inputDesc.name]} id="{inputDesc.name}" name="{inputDesc.name}" type="date">
				</div>
			{/each}
		</Params>

		<Params inputTitle="Sorting" inputDesc="Choose how to sort articles and whether they should be sorted ascending or descending.">
			{#each inputFields.sorting as inputDesc}
				<div class="inputContainer">
					<label for="{inputDesc.name}">{inputDesc.readable}</label>
					<select bind:value={$searchSpecs[inputDesc.name]} id="{inputDesc.name}" name="{inputDesc.name}">
						{#each inputDesc.options as [ value, name ] }
							<option value="{value}">{name}</option>
						{/each}
					</select>
				</div>
			{/each}
		</Params>

		<Params inputTitle="Limit" inputDesc="Limit number of articles queried from server. Higher number will lead to increased server-load.">
			<label for="limit-input">Limit</label>
			<input bind:value={$searchSpecs["limit"]} id="limit-input" name="limit-input" type="number" min="1" max="1000">
		</Params>

		<Params inputTitle="Search Term" inputDesc="Uses nearly same syntax as Google Dorks. Enable highlighting search matches.">
			<input bind:value={$searchSpecs["searchTerm"]} id="searchTerm" name="searchTerm" type="text" placeholder="Search Term">
		</Params>

		<button on:click={() => search($searchSpecs)}>Search content</button>

	</div>
</Modal>

<style type="text/scss">
div.contentContainer {
	display: grid;

	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(4, 3fr) 2fr;

	padding: 2rem;
	box-sizing: border-box;
	overflow: auto;

	height: 100%;

}

div.optionSelectContainer {
	grid-row-start: 1;
	grid-row-end: 5;

	display: flex;
	flex-direction: column;

	border-right: 1px solid #efefef;

	border-bottom: 1px solid #efefef;

	padding-right: 2rem;
}

button {

	@include button;

	align-self: center;
	justify-self: center;

	width: 60%;
	height: 5rem;

	padding: 1rem;

	border-radius: 2px;
	border: 1px solid rgb(90, 90, 90, 0.2);


	@include font(0.5, 700);
	text-transform: uppercase;

	grid-column-start: 1;
	grid-column-end: 3;
}
</style>
