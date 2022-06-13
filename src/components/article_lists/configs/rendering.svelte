<script>
	import Dropdown from "../../shared/dropdown.svelte"
	import { state } from "../../../shared/stores.js"
</script>

<Dropdown>
	{#each ["Title-view", "Large"] as renderingOption}
		<label class="radio">
			<input name="radio" type="radio" bind:group={$state.representation} value={renderingOption}>
			<span>{renderingOption}</span>
		</label>
	{/each}
</Dropdown>

<style type="text/scss">
label {
	@include radio();
}
</style>
