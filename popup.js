var input = document.getElementById('jupyter-token-input')
input.addEventListener('input', (event) => chrome.runtime.sendMessage({ call: 'store', 'token': input.value }));
