<script>
	import { modifyCollection } from "../../lib/user/collections.js"
	import { collectionList, loginState } from "../../shared/stores.js"

	export let ID

	$: readLater = $loginState.loggedIn && $collectionList && "Read Later" in $collectionList && Array.isArray($collectionList["Read Later"]) && $collectionList["Read Later"].includes(ID)

	import Icon from "./icons.svelte";

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
	border: none;
	background-color: transparent;

	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&.read-later {
		color: $main-color;
	}
}
</style>
