<script>
	import Icon from "../shared/icons.svelte";
	import { feeds } from "../shared/stores.js";
</script>

<aside id="navbar">
	<div id="logo-space"><img alt="OSINTer logo" src="https://logos-download.com/wp-content/uploads/2019/07/Feedly_Logo-700x231.png"/></div>
	<button class="long-button"> <Icon name="magnifying-glass"/> <span> Explore Content </span> </button>

	<nav>
		<ul id="selected">
			{#each Object.keys($feeds.mainFeeds) as feed_name }
				<li on:click="{() => console.log(1)}"> <Icon name="{ 'icon' in $feeds.mainFeeds[feed_name] ? $feeds.mainFeeds[feed_name]['icon'] : 'feed' }"/> <span> {feed_name} </span> </li>
			{/each}
		</ul>

		<div class="seperator">
			<h3> FEEDS </h3><button><Icon name="arrow" className="open"/></button>
		</div>
		<ul>
			{#each Object.keys($feeds.userFeeds) as feed_name }
				<li> <Icon name="{ 'icon' in $feeds.userFeeds[feed_name] ? $feeds.userFeeds[feed_name]['icon'] : 'feed' }"/> <span> {feed_name} </span> </li>
			{/each}

			<li> <Icon name="plus"/> <span style="opacity: 0.8">Add feed</span></li>
		</ul>
		<div class="seperator">
			<h3> User </h3> <button><Icon name="arrow" className="open"/></button>
		</div>
		<ul>
			<li> <Icon name="read-later"/> <span> Read later </span> </li>
			<li> <Icon name="gear"/> <span> Configure profile </span>
			<li>  <Icon name="logout"/> <span> Logout </span> </li>
		</ul>

	</nav>

</aside>

<style type="text/scss">
#logo-space {
	height: 4rem;
	padding-left: 1rem;
	overflow: hide;
	display: flex;
	align-items: center;

	border-bottom: 1px solid #efefef;

	img {
		height: 50%;
	}
}

#navbar {
	flex-shrink: 0;
	width: 18rem;
	height: auto;
	height: 100vh;
	overflow-y: auto;

	background: hsl(210, 13%, 97%);
	box-sizing: border-box;

	border-right: 1px solid #efefef;
	nav {
		color: rgb(51, 51, 51);
		font-family: sans-serif;


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

			&#selected {
				li {
					border-left: 5px solid rgb(90, 90, 90, 0.8);
					padding-left: calc(2rem - 5px);

					span {
						@include font(0.8)
					}

					:global(svg) {
						opacity: 0.8;
					}

					&#selected {
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
	}
}

.long-button {
	display: flex;
	align-items: center;

	margin: 1rem;
	margin-bottom: 2rem;
	width: calc(100% - 2rem);
	height: 2.5rem;

	background-repeat: no-repeat;
	overflow: hidden;
	outline: none;

	cursor: pointer;

	border: 1px solid rgb(90, 90, 90, 0.2);
	transition: border-color .2s ease-in-out;

	border-radius: 2px;

	background-color: transparent;

	span {
		flex-grow: 1;
		@include font(0.2);
		transition: color .2s ease-in-out;
	}

	:global(svg) {
		border-right: 1px solid rgb(90, 90, 90, 0.3);

		height: 100%;
		width: 1rem;
		padding: 0.8rem;

		opacity: 0.45;
		transition: border-color .2s ease-in-out, opacity .2s ease-in-out;
	}

	&:hover {
		border-color: rgb(90, 90, 90, 0.4);
		span {
			@include font(0.6);
		}
		:global(svg) {
			opacity: 0.85;
			border-color: rgb(90, 90, 90, 0.5)
		}
	}


}
</style>
