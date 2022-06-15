<script>
	export let ID
	let collectionPromise = []

	import Icon from "./icons.svelte"
	import Loader from "./loader.svelte"
	import Dropdown from "./dropdown.svelte"

	import { modifyCollection, getUserCollections } from "../../lib/user/collections.js"
	import { collectionList, loginState, modalState } from "../../shared/stores.js"

	async function showDropdown() {
		if (!$loginState.loggedIn) {
			$modalState = {"modalType" : "auth", "modalContent" : {"type" : "login", "title" : "Login here", "desc" : "Login here or signup with the link down below to save articles to custom collections."}}
		} else {
			collectionPromise = ( async () => { await getUserCollections(); return $collectionList; } ) ()
		}
	}

	function handleCheckbox(e) {
		collectionPromise = ( async () => { await modifyCollection(e.target.value, e.target.checked ? "extend" : "subtract", ID); return $collectionList; } ) ()
	}

</script>

<button on:click|stopPropagation={showDropdown}>
	<Icon name="favorite"/>

	<Dropdown>
		{#await collectionPromise}
			<Loader height="2rem" />
		{:then currentCollectionList}
			{#each Object.entries(currentCollectionList) as [collectionName, IDs]}
				<label class="radio" on:click|stopPropagation>
					<input name="radio" type="checkbox" on:change={handleCheckbox} value="{collectionName}" checked="{IDs.includes(ID)}">
					<span>{collectionName}</span>
				</label>
			{/each}
		{/await}
	</Dropdown>
</button>

<style lang="scss">
button {
	border: none;
	background-color: transparent;

	display: flex;
	align-items: center;
	justify-content: center;

	position: relative;

	&:focus-within :global(div) {
		display: block;
	}
}

label {
	@include radio();
}

</style>
