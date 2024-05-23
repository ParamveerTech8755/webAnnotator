chrome.runtime.onMessage.addListener(handleMessages)

function handleMessages({type, payload = null}, sender, sendResponse){
	const key = `${sender.url}-annotation-data`
	if(type === 'LOADED'){

		chrome.storage.local.get(key, resArr => {
			if(resArr.length !== 0){
				// alert('loaded from mem')
				sendResponse(resArr)
			}
		})
		// chrome.storage.local.get('key', res => sendResponse(res))
	}
	else if(type === 'SAVE'){
		chrome.storage.local.set({key: payload}, () => {
			sendResponse('data saved')
		})
		// chrome.storage.local.set({'key': [{text: 'hello', x: 1, y: 2}, {text: 'bye', x: 100, y: 200}]}, () => alert('value set'))
	}
}