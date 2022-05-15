<script>
	export let title = ""
	export let menuOptions
	export let menuType

	import OptionList from "./menuOptions.svelte"
	import Icon from "../../shared/icons.svelte";
</script>

{#if title}
<div class="seperator">
	<h3> {title} </h3><button><Icon name="arrow" className="open"/></button>
</div>
{/if}
<OptionList menuOptions={menuOptions} menuType={menuType}>
<slot></slot>
</OptionList>


<style type="text/scss">
.seperator {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 2rem;
	padding-bottom: 0.5rem;

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
		}

		:global(svg.open) {
			transform: rotate(90deg);
		}
		
	}
}
</style>
