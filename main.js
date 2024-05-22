document.addEventListener('dblclick', handleAnnotation)

function createContainer(x, y){
	const container = document.createElement('span')
	container.style.display = 'hidden'
	container.classList.add('annotation-container')
	container.style.left = `${x}px`
	container.style.top = `${y}px`
	return container
}

function createTextArea(){
	const span = document.createElement('span')
	span.contentEditable = 'true'
	return span
}
function createButton(){
	const closeBtn = document.createElement('button')
	closeBtn.classList.add('close-btn')
	closeBtn.appendChild(document.createTextNode('x'))
	return closeBtn
}




function createAnnotationElement({target, pageX, pageY}){
	const container = createContainer(pageX, pageY)
	const text = createTextArea()
	const closeButton = createButton()
	container.appendChild(text)
	container.appendChild(closeButton)

	closeButton.onclick = () => container.remove()
	document.body.appendChild(container)
}

function handleAnnotation(event){
	createAnnotationElement(event)
}