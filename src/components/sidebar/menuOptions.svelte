<script>
	export let menuOptions
	export let menuType
	export let removeFunction = false

	import { state, loginState } from "../../shared/stores.js"
</script>

<ul class:selected="{$state.selectedMenu.name in menuOptions && $state.selectedMenu.type === (menuType ? menuType : menuOptions[$state.selectedMenu.name].type)}">
	{#each Object.keys(menuOptions) as optionName }
		<li class:selected="{$state.selectedMenu.name == optionName && $state.selectedMenu.type === ( menuType ? menuType : menuOptions[optionName].type ) }" on:click="{() => { $state = {...$state, "selectedMenu" : {"name" : optionName, "type" : menuType ? menuType : menuOptions[optionName].type}, "localSearch" : ""}}}">
			<img src="/icons/{ menuOptions[optionName]?.icon ?? 'text-paragraph' }.svg" class="category-icon icon " aria-hidden="true"/>
			<span> {optionName} </span>
			{#if removeFunction && $loginState.loggedIn}
				<button title="Remove { menuType ? menuType : menuOptions[optionName]?.type}" on:click|stopPropagation={removeFunction(optionName)}>
					<img src="/icons/x.svg" class="remove icon" aria-hidden="true"/>
				</button>
			{/if}
		</li>
	{/each}
	<slot></slot>
</ul>

<style lang="scss">
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

		:global(img.category-icon) {
			opacity: 0.4;

			&:not(.small) {
				width: 1.3rem;
				height: 1.3rem;
			}

			&:global(.small) {
				width: 1rem;
				height: 1rem;
			}
		}

		:global(button) {
			@include button(0);

			padding: 0;
			margin-left: auto;
			margin-right: 1rem;

			aspect-ratio: 1/1;

			:global(img.remove) {
				opacity: 0.1;
				transition: opacity 0.4s;

				height: 1.3rem;
				width: 1.3rem;

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	&.selected {
		li {
			border-left: 5px solid rgb(90, 90, 90, 0.8);
			padding-left: calc(2rem - 5px);

			span {
				@include font(0.8)
			}

			img.category-icon {
				opacity: 0.8;
			}

			&.selected {
				span {
					color: $main-color !important;
				}
				img.category-icon {
					filter: $main-color-filter;
				}
				border-color: $main-color !important;
			}

		}
	}

}

</style>
