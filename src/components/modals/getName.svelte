<script>
	import Modal from "./modal.svelte"

	import { modalState } from "../../shared/stores.js"

	let content = ""

	$: readyToCreate = content.length > 0 && Boolean($modalState.modalContent) && "existingNames" in $modalState.modalContent && Array.isArray($modalState.modalContent.existingNames) && !($modalState.modalContent.existingNames.includes(content))
</script>

<svelte:window on:keydown={(e) => {if (e.key === "Enter" && readyToCreate) { $modalState.modalContent.action(content) } }}/>

<Modal height="" width="">
	{#if $modalState.modalContent}
		<div class="content-container">
			<div class="input-container">
				<input name="get-name" id="get-name" type="text" placeholder=" " bind:value={content}>
				<label for="get-name" class="desc">New { $modalState.modalContent.contentType } name</label>
				<button on:click={() => { if (readyToCreate) { $modalState.modalContent.action(content); } }} class:ready={readyToCreate} title="Create new { $modalState.modalContent.contentType }">
					<img src="/icons/send-plus.svg" class="icon" aria-hidden="true">
				</button>
			</div>
		</div>
	{/if}
</Modal>

<style lang="scss">
div.content-container {
	margin: 2rem;
	width: min(100ch, 80vw);

	div.input-container {
		position: relative;
		width: 100%;

		input {
			width: 100%;
			height: 2.5rem;
			box-sizing: border-box;

			border-radius: 0.4rem;

			border: 2px solid $button-grey;
			background-color: hsl(0, 0%, 98.5%);

			padding-left: 1rem;
			@include font(0.8, 400);

			appearance: none;
			outline: 1px solid $white;

			transition: border 200ms ease-in-out, outline 200ms ease-in-out;

			&:hover, &:focus {
				border: 2px solid $white;
				outline: 1px solid $main-color;
			}

			&:hover ~ label, &:focus ~ label {
				color: $main-color;
			}

			&:focus ~ label.desc, &:not(:placeholder-shown) ~ label.desc {
				transform: translateY(-1.4rem) translateX(0.5rem) scale(0.75);
				background-color: $white;
			}

		}

		label.desc {
			text-transform: capitalize;
			@include font(0.6, 300, 0.9rem);

			pointer-events: none;

			position: absolute;
			transform-origin: 0 50%;
			transition: transform 200ms, color 200ms;

			left: 1rem;
			top: .8rem;
			line-height: 1rem;
		}

		button {
			@include button(0);
			padding: 0;

			position: absolute;
			height: 2.5rem;
			width: 2.5rem;

			top: 0;
			right: 0;

			cursor: not-allowed;

			background: none !important;

			img.icon {
				height: 1.2rem;
				width: 1.2rem;

				padding: 0.3rem 0.3rem 0 0.4rem;

				opacity: 0.4;

				border-left: 1px solid rgba(0, 0, 0, 0.4);
			}

			&.ready {
				cursor: pointer;

				img.icon {
					filter: $main-color-light-filter;
					opacity: 0.8;
					border-color: black;

					transition: filter 0.3s, opacity 0.3s;

					&:hover {
						filter: $main-color-filter;
						opacity: 1;
					}
				}
			}
		}
	}
}

</style>
