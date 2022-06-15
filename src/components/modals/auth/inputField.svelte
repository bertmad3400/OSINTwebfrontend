<script>
	export let userDetails
	export let detailName
	export let inputType
	export let label = false

	// Using if statement to determine whether input should be password or text type, instead of dynamically setting type, as dynamic type doesn't work with a two way databinding (as is used to sync the store value with the input) https://stackoverflow.com/questions/57392773/error-type-attribute-cannot-be-dynamic-if-input-uses-two-way-binding
</script>

<div class="input-container">
	{#if detailName.includes("password")}
		<input name="{detailName}-{inputType}" id="{detailName}-{inputType}" type="password" placeholder=" " bind:value={$userDetails[detailName]}>
	{:else}
		<input name="{detailName}-{inputType}" id="{detailName}-{inputType}" type="text" placeholder=" " bind:value={$userDetails[detailName]}>
	{/if}
	<label for="{detailName}-{inputType}" class="desc">{ label ? label : detailName.replace("_", " ")}</label>
</div>

<style lang="scss">
div.input-container {
	position: relative;

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
}
</style>
