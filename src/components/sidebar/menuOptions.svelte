<script>
	export let menuOptions

	import Icon from "../../shared/icons.svelte";
	import { state } from "../../shared/stores.js"

	console.log(menuOptions)
</script>

<ul class:selected="{$state.selectedMenu in menuOptions}">
	{#each Object.keys(menuOptions) as optionName }
		<li class:selected="{$state.selectedMenu == optionName}"
			on:click="{() => $state.selectedMenu = optionName}">
			<Icon name="{ 'icon' in menuOptions[optionName] ? menuOptions[optionName]['icon'] : 'feed' }"/>
			<span> {optionName} </span>
		</li>
	{/each}
	<slot></slot>
</ul>

<style type="text/scss">
ul {
	margin: 0;
	padding: 0;
	list-style-type: none;


	li {
		display: flex;
		align-items: center;

		cursor: pointer;

		padding: 0.4rem;
		padding-left: 2rem;
		padding-right: 0rem;

		&:hover {
			background-color: rgba(0,0,0,.05);
		}

		span {
			margin-left: 0.7rem;
			@include font(0.4);
		}

		:global(svg) {
			opacity: 0.4;
			width: 1.3rem;
			height: 1.3rem;
		}
	}

	&.selected {
		li {
			border-left: 5px solid rgb(90, 90, 90, 0.8);
			padding-left: calc(2rem - 5px);

			span {
				@include font(0.8)
			}

			:global(svg) {
				opacity: 0.8;
			}

			&.selected {
				span {
					color: #2bb24c !important;
				}
				:global(svg) {
					color: #2bb24c !important;
				}
				border-color: #2bb24c !important;
			}

		}
	}

}

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
