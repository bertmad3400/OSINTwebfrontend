<script>
	export let collectionName = "Read Later"
	export let iconName = "read-later"

	import { modifyCollection } from "../../lib/user/collections.js"
	import { collectionList, loginState, modalState } from "../../shared/stores.js"

	export let ID

	$: readLater = $loginState.loggedIn && $collectionList && collectionName in $collectionList && Array.isArray($collectionList[collectionName]) && $collectionList[collectionName].includes(ID)

	import Icon from "./icons.svelte";

	async function toggle () {
		if ($loginState.loggedIn) {
			await modifyCollection(collectionName, readLater ? "subtract" : "extend", ID)
		} else {
			$modalState = {"modalType" : "auth", "modalContent" : {"type" : "login", "title" : "Login here", "desc" : "Login here or signup with the link down below to save articles for later reading."}}
		}
	}
</script>

<button class={ readLater ? "filled" : ""} on:click|stopPropagation={toggle}>
	{#if readLater }
		<Icon name="{iconName}-filled" />
	{:else}
		<Icon name="{iconName}" />
	{/if}
</button>

<style lang="scss">
button {
	border: none;
	background-color: transparent;

	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&.filled {
		color: $main-color;
	}
}
</style>
