<script>
	import { modalState } from "../../shared/stores.js"

	import { fly } from 'svelte/transition';

</script>

<div class="pop-up"
	on:click={() => $modalState = {"modalType" : null, "modalContent" : null}}
	>
	<div class="pop-up-content" on:click|stopPropagation in:fly={{ y: 50 }} out:fly={{ y: 50 }}>
		<slot></slot>
	</div>
</div>

<style type="text/scss">
div.pop-up {
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
