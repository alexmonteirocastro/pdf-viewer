const url = '../docs/primer.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;


const scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // get the page 
    pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // output current page num
        document.querySelector('#page-num').textContent = num
    });
}

// Check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
}

// show previous page
const showPreviousPage = () => {
    if(pageNum <= 1){
        return;
    } 
    pageNum--;
    queueRenderPage(pageNum);
}

// show next page
const showNextPage = () => {
    if(pageNum >= pdfDoc._pdfInfo.numPages){
        return;
    } 
    pageNum++;
    queueRenderPage(pageNum);
}

// Get document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    
    
    document.querySelector('#page-count').textContent = pdfDoc._pdfInfo.numPages

    renderPage(pageNum)
});

// Button event listeners
document.querySelector('#prev-page').addEventListener('click', e => {
    showPreviousPage()
});
document.querySelector('#next-page').addEventListener('click', e => {
    showNextPage()
});