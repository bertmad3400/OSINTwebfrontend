<script>
	import { modalState } from "../../shared/stores.js"
	import { fly, fade } from 'svelte/transition';

</script>

<div class="pop-up" on:click={() => $modalState = {"modalType" : null, "modalContent" : null}} transition:fade="{{ duration: 200 }}" >
	<div class="pop-up-content" on:click|stopPropagation in:fly={{ y: 50 }} out:fly={{ y: 50 }}>
		<slot></slot>
	</div>
</div>

<style type="text/scss">
div.pop-up {
	z-index: 1;

	position: absolute;
	height: 100vh;
	width: 100vw;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	background-color: rgb(0, 0, 0, 0.6);

	div.pop-up-content {

		width: 80vw;
		height: 90vh;

		background-color: #ffffff;

	}
}
</style>
