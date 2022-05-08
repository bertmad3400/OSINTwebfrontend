<script>
	import SideBar from "./components/sidebar.svelte"
	import MainWindow from "./components/main_window.svelte"
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
