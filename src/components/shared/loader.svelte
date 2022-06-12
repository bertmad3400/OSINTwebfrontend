<script>
	export let width = null
	export let height = null
	export let text = false

	import { onMount } from "svelte";

	let dotCounter = 1

	onMount(() => {
		setInterval(() => {
			dotCounter = dotCounter % 3 + 1;
		}, 1000);
	});
</script>

<div class="loading-container">
	<div style="{width ? "width: " + width + ";" : ""} {height ? "height:" + height + ";" : ""}" class="loading-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
	{#if text}
		<p>Loading{".".repeat(dotCounter)}</p>
	{/if}
</div>

<style type="text/scss">
div.loading-container {
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	p {
		margin-top: 1rem;
		@include font(1, 100);
	}

	.loading-grid {
		aspect-ratio: 1 / 1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 5% 5%;
	}

	.loading-grid div {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: $main-color;
		animation: loading-grid 1.5s linear infinite;
	}

	@for $i from 1 through 9 {
		.loading-grid div:nth-child(#{$i}) {
			animation-delay: random(150) / 100 + s;
		}
	}
	@keyframes loading-grid {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
}
</style>
