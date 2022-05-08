<script>
	import Icon from "../shared/icons.svelte"
</script>

<form role="search" id="search-box">
	<label for="search-field"><Icon name="magnifying-glass"/></label>
	<input id="search-field" type="text" placeholder="Search...">
</form>

<style type="text/scss">
#search-box {
	height: 4rem;
	border-bottom: 1px solid #efefef;

	display: flex;
	align-items: center;

	label {
		opacity: 40%;
		margin: 1.1rem;
		cursor: text;
	}
	input {
		padding: 0rem;
		border: none;

		@include font(0.5, 500);
		height: 100%;
		flex-grow: 1;
		outline: 0;
	}
}

</style>
