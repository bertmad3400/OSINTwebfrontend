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
					searchSpecs.set({...appConfig.defaultOptions.search, ...$feeds[feedCategory][$state.selectedMenu.name].searchQuery})
					return
				}
			}
		}

		searchSpecs.set(appConfig.defaultOptions.search)
	})

</script>


<Modal>
	<div class="contentContainer">
		<div class="optionContainer">
			<SourceSelect searchSpecs={searchSpecs}/>
		</div>

		<div class="optionContainer seperateOptions">
			<h1>Specify Search</h1>

			<Params inputTitle="Timespan" inputDesc="Enter wanted date interval. Only articles published within this interval will be shown.">
				{#each inputFields.timespan as inputDesc}
					<div class="input">
						<input bind:value={$searchSpecs[inputDesc.name]} id="{inputDesc.name}" name="{inputDesc.name}" type="text" placeholder=" " onfocus="(this.type='date')" onblur="(this.type='text')">
						<label class="desc" for="{inputDesc.name}">{inputDesc.readable}</label>
					</div>
				{/each}
			</Params>

			<Params inputTitle="Sorting" inputDesc="Choose how to sort articles and whether they should be sorted ascending or descending.">
				{#each inputFields.sorting as inputDesc}
					<div class="input">
						<select bind:value={$searchSpecs[inputDesc.name]} id="{inputDesc.name}" name="{inputDesc.name}" placeholder=" ">
							<option value="" disabled selected>{inputDesc.readable}</option>
							{#each inputDesc.options as [ value, name ] }
								<option value="{value}">{name}</option>
							{/each}
						</select>
						<label class="desc" for="{inputDesc.name}">{inputDesc.readable}</label>
					</div>
				{/each}
			</Params>

			<Params inputTitle="Limit" inputDesc="Limit number of articles queried from server. Higher number will lead to increased server-load.">
				<div class="input">
					<input bind:value={$searchSpecs["limit"]} id="limit-input" name="limit-input" type="number" min="1" max="1000" placeholder=" ">
					<label for="limit-input" class="desc">Limit</label>
				</div>
			</Params>

			<Params inputTitle="Search Term" inputDesc="Uses nearly same syntax as Google Dorks. Enable highlighting search matches.">
				<div class="input">
					<input bind:value={$searchSpecs["searchTerm"]} id="searchTerm" name="searchTerm" type="text" placeholder=" ">
					<label for="searchTerm" class="desc">Search Term</label>
				</div>
			</Params>

			<button on:click={() => search($searchSpecs)}>Search content</button>
		</div>
	</div>
</Modal>

<style type="text/scss">
div.contentContainer {
	display: flex;

	padding: 2rem;
	box-sizing: border-box;
	overflow: auto;

	height: 100%;

}

div.optionContainer {

	display: flex;
	flex-direction: column;

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

h1 {
	@include font(0.8, 600, 1.3rem);
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

div.input {
	position: relative;
	height: 4rem;

	display: flex;
	justify-content: center;
}

input , select{
	width: 100%;
	height: 80%;

	margin: auto;
	box-sizing: border-box;

	border-radius: 0.4rem;

	border: 2px solid $button-grey;
	background-color: hsl(0, 0%, 98.5%);

	padding-left: 1rem;
	@include font(0.8, 400);

	appearance: none;
	outline: 1px solid $white;

	transition: border 200ms ease-in-out, outline 200ms ease-in-out;

	&:hover, &:focus {
		border: 2px solid $white;
		outline: 1px solid $main-color;
	}

	&:hover ~ label.desc, &:focus ~ label.desc {
		color: $main-color;
	}

	&:focus ~ label.desc, &:not(:placeholder-shown) ~ label.desc {
		transform: translateY(-230%) scale(0.75);
		background-color: $white;
	}
}

label.desc {
	text-transform: capitalize;
	@include font(1, 200, 0.9rem);

	pointer-events: none;

	position: absolute;
	transform-origin: 0 50%;
	transition: transform 200ms, color 200ms;

	left: 1rem;
	top: 40%;
	line-height: 1rem;
}

</style>
