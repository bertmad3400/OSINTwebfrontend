<script>
	export let title = ""
	export let menuOptions = {}
	export let menuType = ""

	let open = true

	import { slide } from 'svelte/transition';

	import OptionList from "./menuOptions.svelte"
	import Icon from "../../shared/icons.svelte";
</script>

{#if title}
<div class="seperator">
	<h3> {title} </h3><button on:click={() => open = !open} ><Icon name="arrow" className={open ? "open" : ""}/></button>
</div>
{/if}

{#if open}
<div transition:slide>
<OptionList  menuOptions={menuOptions} menuType={menuType}>
<slot></slot>
</OptionList>
</div>
{/if}


<style type="text/scss">
.seperator {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 2rem 0 2rem;

	h3 {
		display: inline-block;
		color: #9e9e9e;
		font-size: .6875rem;
		font-weight: normal;
		margin: 0;
		text-transform: uppercase;
	}

	button {
		@include button();

		:global(svg) {
			opacity: 0.45;
			transition: transform 0.4s;
		}

		:global(svg.open) {
			transform: rotate(90deg);
			transition: transform 0.4s;
		}
		
	}
}
</style>
