<script>
	export let title = ""
	export let menuOptions = {}
	export let menuType = ""

	let open = true

	import { slide } from 'svelte/transition';

	import OptionList from "./menuOptions.svelte"
	import Collapse from "../shared/collapseArrow.svelte"
</script>

{#if title}
<div class="seperator">
	<h3> {title} </h3> <Collapse bind:open />
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

}
</style>
