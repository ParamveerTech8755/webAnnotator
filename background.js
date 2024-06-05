chrome.runtime.onInstalled.addListener(() => {
  alert('Extension installed:\nDouble click anywhere to annotate and select text to highlight')
  chrome.storage.sync.set({ highlights: [] })
});

chrome.runtime.onMessage.addListener(handleMessages)

function handleMessages({type, payload = null}, sender, sendResponse){

	if(type === 'LOADED'){
		// console.log(key)
		chrome.storage.local.get('annotationData', res => {
			if(res){
				// alert('loaded from mem')
				const response = res.annotationData.filter(item => item.url === sender.url)
				sendResponse({annotationData: response})
			}
			else{
				sendResponse({annotationData: []})
			}
		})
	}
	else if(type === 'SAVE'){
		chrome.storage.local.get('annotationData', ({annotationData}) => {
			let index = annotationData.findIndex(item => item.id === payload.id)
			if(index > 0)
				annotationData[index] = payload
			else
				annotationData.push(payload)
			chrome.storage.local.set({'annotationData': annotationData}, () => sendResponse('data saved'))
		})


	}
	else if(type === 'DELETE'){
		chrome.storage.local.get('annotationData', ({annotationData}) => {
			const annotations = annotationData.filter(item => item.id !== payload.id)
			chrome.storage.local.set({'annotationData': annotations}, () => sendResponse('item deleted'))
		})
	}

	return true
}
