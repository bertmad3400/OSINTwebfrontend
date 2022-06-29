<script>
	export let padding = "1.3rem"
</script>

<div class="dropdown" style="padding: { padding };">
	<slot></slot>
</div>

<style lang="scss">


.dropdown {
	display: none;
	position: absolute;
	top: 130%;

	z-index: 1;

	border-radius: .25rem;
	box-shadow: 0 2px 8px rgba(0,0,0,.2),0 0 2px rgba(0,0,0,.38);
	background-color: $white;
}
</style>
