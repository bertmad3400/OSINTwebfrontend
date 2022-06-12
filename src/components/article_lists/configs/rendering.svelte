<script>
	import Dropdown from "../../shared/dropdown.svelte"
	import { state } from "../../../shared/stores.js"
</script>

<Dropdown>
	{#each ["Title-view", "Large"] as renderingOption}
		<label class="radio">
			<input name="radio" type="radio" bind:group={$state.representation} value={renderingOption}>
			<span>{renderingOption}</span>
		</label>
	{/each}
</Dropdown>

<style type="text/scss">
.radio{
	display: block;
	cursor: pointer; 
	user-select:none;

	text-align: left;
	min-width: max-content;

	&+.radio{
		margin-top: 1rem;
	}

	input{
		display: none;

		&+span{
			display: inline-block; 
			position: relative;
			padding-left: 2rem;
			&:before{
				content: '';
				display: block; 
				position: absolute;
				top: 0px;
				left: 0px;
				border-radius: 50%;
				margin-right: 5px;
				width: 16px;
				height: 16px;
				border: 1px solid #ccc;
			}
			&:after{
				content: '';
				display: block; 
				width: 10px;
				height: 10px;
				background: #222;
				position: absolute;
				border-radius: 50%;
				top: 4px;
				left: 4px;
				opacity: 0;
				transform: scale(0,0); 
				transition: all .2s cubic-bezier(0.64, 0.57, 0.67, 1.53);
			}

			font-family: sans-serif;
			font-weight: 500;
			font-size: 0.875rem;
		}
		&:checked+span:after{
			opacity: 1;
			transform: scale(1,1);
		}
	}
}
</style>
