const url = 'file.pdf';
const book = document.getElementById('book');

let pdfDoc = null;
let currentPage = 0;
let pages = [];

pdfjsLib.getDocument(url).promise.then(function(pdf) {
    pdfDoc = pdf;

    for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function(page) {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({
                canvasContext: context,
                viewport: viewport
            });

            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.style.zIndex = pdf.numPages - i;

            pageDiv.appendChild(canvas);
            book.appendChild(pageDiv);

            pages.push(pageDiv);
        });
    }
});

function nextPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add('flipped');
        currentPage++;
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].classList.remove('flipped');
    }
}