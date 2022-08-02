<script>
	export let inputTitle
	export let inputDesc
</script>

<div class="paramContainer">
	<h2 title="{inputDesc}">{inputTitle}</h2>
	<hr>
	<form on:submit|preventDefault>
		<slot></slot>
	</form>
</div>

<style lang="scss">
div.paramContainer {
	display: flex;
	flex-direction: column;

	margin-bottom: 0.5rem;

	h2 {
		@include font(0.8, 400, 1rem);
	}

	hr {
		margin: 0.3rem 0 0.7rem 0;
	}

	form {
		display: flex;
		flex-direction: column;

		position: relative;
		height: 100%;
	}
}
</style>
