<script>
	export let ID

	import ReadLaterButton from "./readLater.svelte"

	import { state } from "../../shared/stores.js"
</script>

{#if $state.selectedMenu.type == "collection"}
	<ReadLaterButton {ID} collectionName="{$state.selectedMenu.name}" iconName="favorite" />
{:else}
	<ReadLaterButton {ID} />
{/if}

<style type="text/scss">
</style>
