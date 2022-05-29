<script>
	export let readLater
	export let ID

	import { modifyCollection } from "../../../lib/collections.js"
	import { loginState } from "../../../shared/stores.js"

	import Icon from "../../../shared/icons.svelte";

	async function toggle () {
		if ($loginState.loggedIn) {
			await modifyCollection("Read Later", readLater ? "subtract" : "extend", ID)
		}
	}
</script>

<button class={ readLater ? "read-later" : ""} on:click|stopPropagation={toggle}>
	{#if readLater }
		<Icon name="read-later-filled" />
	{:else}
		<Icon name="read-later" />
	{/if}
</button>

<style type="text/scss">
button {
	@include button();

	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&.read-later {
		color: hsl(135deg, 60%, 45%);
	}
}
</style>
