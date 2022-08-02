<script>
	export let closed
</script>

<button class="collapse" on:click={() => closed = !closed} ><img src="/icons/chevron-down.svg" class="{closed ? "closed" : ""} icon" aria-hidden="true"/></button>

<style lang="scss">
button.collapse {
	@include button();

	padding: 0.5rem;

	img.icon {
		opacity: 0.45;
		transition: transform 0.4s;
	}

	img.icon.closed {
		transform: rotate(-90deg);
		transition: transform 0.4s;
	}
	
}
</style>
