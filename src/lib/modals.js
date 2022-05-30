import { modalState } from "../shared/stores.js"

export function showSearch() {
	modalState.set({"modalType" : "search", "modalContent" : null})
	document.activeElement.blur()
}

