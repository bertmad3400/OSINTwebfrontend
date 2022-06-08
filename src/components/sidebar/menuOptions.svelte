<script>
	export let menuOptions
	export let menuType

	import Icon from "../shared/icons.svelte";
	import { state } from "../../shared/stores.js"
</script>

<ul class:selected="{$state.selectedMenu.name in menuOptions}">
	{#each Object.keys(menuOptions) as optionName }
		<li class:selected="{$state.selectedMenu.name == optionName}" on:click="{() => { $state = {...$state, "selectedMenu" : {"name" : optionName, "type" : menuType ? menuType : menuOptions[optionName].type}, "localSearch" : ""}}}">
			<Icon name="{ 'icon' in menuOptions[optionName] ? menuOptions[optionName]['icon'] : 'feed' }"/>
			<span> {optionName} </span>
		</li>
	{/each}
	<slot></slot>
</ul>

<style type="text/scss">
ul {
	margin: 0;
	padding: 0 0 2rem 0;
	list-style-type: none;


	:global(li) {
		display: flex;
		align-items: center;

		cursor: pointer;

		padding: 0.4rem;
		padding-left: 2rem;
		padding-right: 0rem;

		&:hover {
			background-color: $button-grey;
		}

		:global(span) {
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
					color: $main-color !important;
				}
				:global(svg) {
					color: $main-color !important;
				}
				border-color: $main-color !important;
			}

		}
	}

}

</style>
