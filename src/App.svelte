<script>
	import SideBar from "./components/sidebar.svelte"
	import MainWindow from "./components/main_window.svelte"

	import { appConfig } from "./shared/config.js"
	import { feeds, articles } from "./shared/stores.js"

	$feeds = appConfig.feeds
</script>

<main>
	<SideBar />
	<MainWindow />
</main>

<style type="text/scss">
main {
	display: flex;
	align-content: center;
	height: auto;
	min-height: 100%;
	overflow: hidden;
}
</style>
