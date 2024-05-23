const allAnnotations = []

// const Browser = browser || chrome
document.addEventListener('dblclick', handleAnnotation)
// document.body.onload = function() {
// 	chrome.runtime.sendMessage({type: 'LOADED'}, annotations => {
// 		if(chrome.runtime.lastError)
// 			console.log('ouch')
// 		else{
// 			console.log(annotations)
// 			annotations.forEach(({x,y, text}) => {
// 				createAnnotationElement({x, y}, text)
// 				allAnnotations.push({x,y,text})
// 				// console.log(allAnnotations)
// 			})
// 		}
// 	})
// }

function createContainer(x, y){
	const container = document.createElement('div')
	container.style.display = 'hidden'
	container.classList.add('annotation-container')
	container.style.left = `${x}px`
	container.style.top = `${y}px`
	return container
}

function createField(content, contentEditable){
	const span = document.createElement('span')
	if(contentEditable){
		span.contentEditable = 'true'
		span.style.whiteSpace = "pre-wrap"
		span.classList.add('input')
	}
	if(content){
		const text = document.createTextNode(content)
		span.appendChild(text)
	}
	return span
}
function createCloseButton(){
	const closeBtn = document.createElement('button')
	closeBtn.classList.add('close', 'btn')
	closeBtn.appendChild(document.createTextNode('x'))
	return closeBtn
}

function createSaveButton(target, x, y){
	const saveBtn = document.createElement('button')
	saveBtn.classList.add('btn', 'save')
	saveBtn.appendChild(document.createTextNode('save'))
	saveBtn.onclick = () => onSave(target.textContent, x, y)
	return saveBtn
}


function onSave(text, x, y) {
	allAnnotations.push({
		text,
		x,
		y
	})
	// console.log(allAnnotations)
	chrome.runtime.sendMessage({type: 'SAVE', payload: allAnnotations}, res => {
		console.log(res)
	})
}
//i will need to store.
/*
what to display
-the text

and where to display
--save the url and the coords

localStorage.setItem
[
	{
		url:,
		annotations: [
			{text, x, y}	
		]
	}
]
*/

function createAnnotationElement({pageX, pageY}, text = ""){
	const container = createContainer(pageX, pageY)
	const content = createField(text, true)
	const wrapper = createField('', false)
	const saveButton = createSaveButton(content, pageX, pageY)
	const closeButton = createCloseButton()
	wrapper.classList.add('btn-wrapper')
	wrapper.appendChild(saveButton)
	wrapper.appendChild(closeButton)
	container.appendChild(content)
	container.appendChild(wrapper)
	container.addEventListener('mouseover', () => {
		wrapper.style.visibility = 'visible'
	})
	container.addEventListener('mouseout', () => wrapper.style.visibility = 'hidden')

	closeButton.onclick = () => container.remove()
	document.body.appendChild(container)
}

function handleAnnotation(event){
	createAnnotationElement(event)
}