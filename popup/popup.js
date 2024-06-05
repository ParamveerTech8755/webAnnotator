document.querySelectorAll('.highlight').forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setHighlightColor', color: color });
    });
  });
});

document.querySelectorAll('.text').forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setTextColor', color: color });
    });
  });
});

chrome.storage.sync.get('highlights', (data) => {
  const highlights = data.highlights || [];
  const list = document.getElementById('highlights-list');
  highlights.slice(-5).reverse().forEach(highlight => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${highlight.text.substring(0, 50)}${highlight.text.length > 50 ? '...' : ''}`;
    li.appendChild(span);
    list.appendChild(li);
  });
});