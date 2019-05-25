function getNotebookLinks() {
    let files = document.querySelectorAll('.file > .js-file-content');
    let aTags = document.querySelectorAll("div.file-header.file-header--expandable.js-file-header.sticky-file-header.js-position-sticky > div.file-actions > div > details > details-menu > a:nth-child(3)")
    let notebookLinks = [];
    console.log(files.length, aTags.length);
    for (var i = 0; i < aTags.length; ++i) {
        let href = aTags[i].href;
        if (href.endsWith('.ipynb')) {
            nameWithHash = /blob\/(.*)/.exec(href)[1]
            notebookLinks.push({ url: href.replace('/blob/', '/raw/'), div: files[i], nameWithHash: nameWithHash });
        }
    }
    return notebookLinks;
}


function downloadNotebook(url, callback) {
    chrome.runtime.sendMessage({ call: "downloadRaw", url: url }, callback);
}

function renderNotebook(content, div, name) {
    chrome.runtime.sendMessage({ call: "renderNotebook", content: content, name },
        (response) => div.innerHTML = response);
}

let links = getNotebookLinks();
links.forEach(l => {
    l.div.innerHTML = 'Rendering in progress...'
    let renderer = (content) => renderNotebook(content, l.div, l.nameWithHash);
    downloadNotebook(l.url, renderer)
});
