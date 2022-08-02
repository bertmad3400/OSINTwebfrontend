<script>
	import Collapse from "../../shared/collapseArrow.svelte"

	export let title
	export let closed
</script>

<h1>{title}<Collapse bind:closed/></h1>

<style lang="scss">
h1 {
	@include font(0.8, 600, 1.3rem);
	margin-bottom: 1rem;

	display: flex;
	justify-content: space-between;
}
</style>
