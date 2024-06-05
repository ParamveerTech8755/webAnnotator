const allAnnotations = []
let currentTextColor = "#000"


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setTextColor') {
    currentTextColor = request.color;
  }
});



document.addEventListener('dblclick', event => createAnnotationElement(event))
document.body.onload = function() {
	chrome.runtime.sendMessage({type: 'LOADED'}, ({annotationData}) => {
		if(chrome.runtime.lastError)
			console.log('internal error occured')
		else{
			if(annotationData){
				annotationData.forEach(({x,y, text, id, url, color}) => {
					const pos = {
						pageX: x,
						pageY: y
					}
					createAnnotationElement(pos, text, color)
					allAnnotations.push({x, y, text, url, id})
				})
			}
		}
	})
}

function createContainer(x, y, color = currentTextColor){
	const container = document.createElement('div')
	container.style.display = 'hidden'
	container.classList.add('annotation-container')
	container.style.left = `${x}px`
	container.style.top = `${y}px`
	container.style.color = color
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
	closeBtn.classList.add('extension-close', 'extension-btn')
	closeBtn.appendChild(document.createTextNode('x'))
	return closeBtn
}

function createSaveButton(target, x, y){
	const saveBtn = document.createElement('button')
	saveBtn.classList.add('extension-btn', 'extension-save')
	saveBtn.appendChild(document.createTextNode('save'))
	saveBtn.onclick = () => onSave(target.textContent, x, y)
	return saveBtn
}


function onSave(text, x, y) {
	const newElement = {
		id: 100*x + y + '',
		text,
		x,
		y,
		url: location.href,
		color: currentTextColor
	}
	allAnnotations.push(newElement)
	chrome.runtime.sendMessage({type: 'SAVE', payload: newElement})
}

function createAnnotationElement({pageX, pageY}, text = "", color = currentTextColor){
	const container = createContainer(pageX, pageY, color)
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

	closeButton.onclick = () => {
		container.remove()
		chrome.runtime.sendMessage({type: 'DELETE', payload: {id: 100*pageX + pageY + ''}})
	}
	document.body.appendChild(container)
}