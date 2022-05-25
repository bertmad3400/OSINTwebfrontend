<script>
	export let inputTitle
	export let inputDesc
</script>

<div class="paramContainer">
	<h2>{ inputTitle }</h2>
	<p> - { inputDesc }</p>
	<hr>

	<form on:submit|preventDefault>
		<slot></slot>
	</form>
</div>

<style type="text/scss">
div.paramContainer {
	padding-left: 2rem;

	h2, p {
		display: inline;
	}

	h2 {
		@include font(0.8, 700, 1.5rem);
	}

	p {
		@include font(0.8, 200, 0.8rem);
	}

	hr {
		margin-bottom: 1rem;
	}

	form {
		display: flex;


		:global(div.inputContainer) {
			display: flex;
			flex-direction: column;
		}
		
	}
}
</style>
