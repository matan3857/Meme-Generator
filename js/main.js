var gCanvas;
var gCtx;


function init() {
    // renderGallery()
    // setDefaultProp();
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    input = document.querySelector('[name=txt]')
    input.addEventListener('input', onText)
    renderGallery()
}

function renderGallery() {
    var imgs = getImgs()
    var strHtmls = imgs.map(function(img) {
        return `
        <img onclick="onSelectImg('${img.id}')" class="img-meme" src="${img.url}" alt="" width="250" height="250" />
        `
    })
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
}


function onSelectImg(imgId) {
    setMemeDefault()
    updateMemeImg(imgId);
    renderCanvas()

    //Default Prefs
    document.querySelector('.color').value = 'black'
    document.querySelector('.stroke-color').value = '#ffffff'
    document.querySelector('.font-selector').value = 'Arial'


    hideGallery()
    showGenerator()
}


function renderCanvas() {
    var img = new Image()
    let imgId = getImgId();
    img.src = getImgById(+imgId).url
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        let lines = getLines();
        lines.forEach(function(line, lineIdx) {
            drawText(line.txt, line.pos.x, line.pos.y, lineIdx)
        });
    }

}

function drawRect(x, y, txtHeight, textLength) {
    gCtx.beginPath()
    gCtx.rect(x, y - txtHeight * 0.9, textLength * 1.05, txtHeight)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}


function drawText(txt, x, y, lineIdx) {
    let currLine = getCurrLineIdx()

    gCtx.lineWidth = 2
    gCtx.strokeStyle = getStrokeColor(lineIdx);
    gCtx.fillStyle = getColor(lineIdx)
    gCtx.font = getSize(lineIdx) + 'px ' + getFont(lineIdx);
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y)
    gCtx.save();
    if (lineIdx === currLine) {
        let pos = getCurrLinePos(lineIdx)
        textLength = gCtx.measureText(txt).width
        drawRect(pos.x, pos.y, pos.size, textLength)
    }
}

function onNewLine() {
    addNewLine('new Text')
    renderLinePref()
    render()
}


function onText() {
    addLine(input.value)
    render()
}

function onDown() {
    getLineDown()
    render()
}

function onUp() {
    getLineUp()
    render()
}

function onRight() {
    getLineRight()
    render()
}

function onLeft() {
    getLineLeft()
    render()
}

function onPlus() {
    plusSize()
    render()
}

function onMinus() {
    minusSize()
    render()
}

function onDeleteLine() {
    deleteLine()
    render()
}

function onSetColorFill(color) {
    setColorFill(color)
    render()
}

function onSetColorStroke(color) {
    setColorStroke(color)
    render()
}

function onChangeFont(font) {
    changeFont(font)
    render()
}


function render() {
    clearCanvas()
    renderCanvas()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onSwitchLines() {
    switchLines()
    renderLinePref()
    render()
}

function onBackToGal() {
    setMemeDefault()
    showGallery();
    hideGenerator();
}

function onDownloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
}

function renderLinePref() {
    let currLine = getCurrLine()
        // document.querySelector('.color').value = currLine.color
        // document.querySelector('.stroke-color').value = currLine.strokeColor
    document.querySelector('.font-selector').value = currLine.font
    document.querySelector('[name=txt]').value = currLine.txt
}