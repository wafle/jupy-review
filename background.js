var jupyterToken = '';
function createDirectory(path) {
    let url = 'http://localhost:8888/api/contents/' + path;
    let data = { type: 'directory' };
    let param = {
        method: "PUT", body: JSON.stringify(data),
        headers: { "content-type": "application/json; charset=UTF-8", 'Authorization': 'Token ' + jupyterToken }
    };
    fetch(url, param);
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        if (request.call == 'renderNotebook') {
            let notebookName = 'jupy-review/' + request.name.replace(/\//g, '_');
            let url = 'http://localhost:8888/api/contents/' + notebookName;
            let data = { content: request.content, format: 'text', type: 'notebook' }
            let param = {
                method: "PUT", body: JSON.stringify(data),
                headers: { "content-type": "application/json; charset=UTF-8", 'Authorization': 'Token ' + jupyterToken }
            }
            fetch(url, param)
                .then(f => fetch('http://localhost:8888/nbconvert/html/' + notebookName))
                .then((data) => data.text())
                .then(t => sendResponse(t));
        } else if (request.call == 'downloadRaw') {
            fetch(request.url)
                .then(d => d.json())
                .then(t => sendResponse(t));
        } else if (request.call == 'store') {
            jupyterToken = request.token;
            createDirectory('jupy-review')
        };
        return true;
    }
);