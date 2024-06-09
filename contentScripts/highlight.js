let currentHighlightColor = '#ffff00'; // Default color: yellow
let currentHighlighterImg = null

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setHighlightColor') {
    currentHighlightColor = request.color;
  }
});

function highlightText(selection){
    const range = selection.getRangeAt(0)
    const newNode = document.createElement('span');
    newNode.style.display = 'inline'
    newNode.style.padding = '1px 0'
    newNode.style.color = 'black'
    newNode.style.backgroundColor = currentHighlightColor;
    range.surroundContents(newNode);
    selection.removeAllRanges();
}
document.addEventListener('mousedown', event => {
  if(currentHighlighterImg && event.target !== currentHighlighterImg){
    document.body.removeChild(currentHighlighterImg)
    currentHighlighterImg = null
  }
})

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0 && !currentHighlighterImg) {
    const range = selection.getRangeAt(0);

    const img = document.createElement('img')
    img.src = chrome.runtime.getURL('./images/highlight.png')
    img.style.height = "24px"
    img.style.width = "20px"

    const rangeBounds = range.getBoundingClientRect()
    // console.log(rangeBounds)
    img.display = 'inline'
    img.style.position = 'absolute'
    img.style.top = `${event.pageY-10}px`
    img.style.left = event.pageX  + 20 + 'px'
    document.body.appendChild(img)

    img.onclick = () => {
      highlightText(selection)
      img.remove()
      currentHighlighterImg = null
    }

    img.addEventListener('mouseover', () => {
      img.style.transform = 'scale(1.2)'
      img.style.cursor = 'pointer'
    })
    img.addEventListener('mouseout', () => {
      img.style.transform = 'scale(1)'
    })
    currentHighlighterImg = img


    // Save the highlighted text
    chrome.storage.sync.get('highlights', (data) => {
      const highlights = data.highlights || [];
      highlights.push({ text: selectedText, color: currentHighlightColor, url: location.href });
      chrome.storage.sync.set({ highlights: highlights });
    });
  }
});