<script>
	export let open
	import Icon from "./icons.svelte";
</script>

<button class="collapse" on:click={() => open = !open} ><Icon name="arrow" className={open ? "open" : ""}/></button>

<style lang="scss">
button.collapse {
	@include button();

	:global(svg) {
		opacity: 0.45;
		transition: transform 0.4s;

		height: 1.2rem;
		width: 1.2rem;
	}

	:global(svg.open) {
		transform: rotate(90deg);
		transition: transform 0.4s;
	}
	
}
</style>
