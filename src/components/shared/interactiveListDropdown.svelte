<script>
	export let processClick
	export let listOptions
	export let successMessage
	export let iconName = "copy"

	let loading = false

	import Icon from "./icons.svelte"
	import Loader from "./loader.svelte"
	import Dropdown from "./dropdown.svelte"
</script>

<button on:click|stopPropagation={() => loading = false}>
	<Icon name={iconName}/>

	<Dropdown>
		{#if !loading}
			<ul>
			{#each Object.keys(listOptions) as option}
				<li on:click|stopPropagation={() => loading = processClick(option)}>{ option }</li>
			{/each}
			</ul>
		{:else}
			{#await loading}
				<Loader height="3rem"/>
			{:then loadingResult}
				<p>{ loadingResult ? successMessage : "Failed, try again" }</p>
			{/await}
		{/if}
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

	ul {
		list-style-type: none;
		padding: 0;

		li {
			min-width: max-content;
			padding: 1rem;
			@include font(1, 200);

			transition: background-color 0.2s ease-in-out;

			&:hover {
				background-color: $base-grey;
			}

			&+li {
				margin-top: -0.7rem;
			}

		}
	}

	p {
		@include font(0.5, 600);
		min-width: 4rem;
		height: 2rem;
		padding: 1rem;

		transition: background-color 0.2s ease-in-out;

		&:hover {
			background-color: $base-grey;
		}
	}
}
</style>
