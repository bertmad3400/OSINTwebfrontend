<script>
	import SourceSelect from "./sourceSelect.svelte"
	import Modal from "../modal.svelte"

	import { writable } from 'svelte/store'
	
	import { appConfig } from "../../../shared/config.js"

	const searchSpecs = writable({
		"sourceCategory" : [],
		"sortBy" : "publish_date",
		"sortOrder" : "desc",
		"firstDate" : null,
		"lastDate" : null,
		"searchTerm" : null,
		"limit" : appConfig.defaultLimit,
		"highlight" : false
	})

</script>


<Modal>
	<div class="contentContainer">
		<div class="optionSelectContainer">
			<SourceSelect searchSpecs={searchSpecs}/>
		</div>
	</div>
</Modal>

<style type="text/scss">
div.contentContainer {
	display: grid;

	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(4, 1fr);
	gap: 2rem 2rem;

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
}
</style>
