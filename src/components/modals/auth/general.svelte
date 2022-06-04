<script>
	export let title = ""
	export let message = ""
	import Icon from "../../../shared/icons.svelte"
</script>

<div class="content-container">
	<div class="logo-container"><Icon name="logo"/></div>

	<h1>{title}</h1>
	<p>{message}</p>

	<slot></slot>
</div>

<style type="text/scss">
div.content-container {
	padding: 10vh 6rem 0 6rem;
	height: 100%;
	box-sizing: border-box;

	overflow: auto;

	display: flex;
	flex-direction: column;
	align-items: center;

	div.logo-container {
		border-radius: 50%;
		width: 4rem;
		height: 4rem;

		margin-bottom: 3rem;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;

		background-color: $base-grey;
		border: 1px solid hsl(0deg, 0%, 92%);

		:global(svg) {
			width: 60%;
			height: 60%;

			color: $main-color;
		}
	}

	h1, p {
		text-align: center;
	}

	h1 {
		@include font(1, 700, 2rem);
	}

	p {
		@include font(1, 200);
		margin-bottom: 2rem;
	}
}
</style>
