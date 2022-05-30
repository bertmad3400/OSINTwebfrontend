import { modalState } from "../shared/stores.js"

export function showSearchModal() {
	modalState.set({"modalType" : "search", "modalContent" : null})
	document.activeElement.blur()
}
