const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
]

export function getTimespan(origDate) {
	let timeSpan = (Date.now() - Date.parse(origDate)) / 1000
	for (let [name, seconds] of epochs) {
		if (timeSpan > seconds) {
			let timeAmount = Math.floor(timeSpan / seconds)
			return `${timeAmount} ${name}${timeAmount > 1 ? "s" : ""} ago`
		}
	}
}
