'use strict'

let gCanvas;
let gCanvasWidth
let gCtx;
let gInput
let gIsDownload = false

function init() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gInput = document.querySelector('[name=txt]')
    gInput.addEventListener('input', onText)
    renderGallery()
    onRenderKeywords()

    gCanvasWidth = gCanvas.width
    addListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onGrabMove)
    gCanvas.addEventListener('mousedown', onGrabDown)
    gCanvas.addEventListener('mouseup', onGrabUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onGrabMove)
    gCanvas.addEventListener('touchstart', onGrabDown)
    gCanvas.addEventListener('touchend', onGrabUp)
}


function renderCanvas() {
    if (gIsUploadImg) {
        renderImg(gUploadImg)
            //CHECK
            //gCanvas.height = gUploadImg.height
            //gCanvas.width = gUploadImg.width

        let lines = getLines()
        lines.forEach(function(line, lineIdx) {
            drawText(line.txt, line.pos.x, line.pos.y, lineIdx)
        });
    } else {
        let img = new Image()
        let imgId = getImgId();
        img.src = getImgById(+imgId).url
            //CHECK
            //gCanvas.height = img.height
            //gCanvas.width = img.width
        img.onload = () => {
            // let scale = Math.min(gCanvas.width / img.width, gCanvas.height / img.height);
            // gCanvas.width = img.width * scale
            // gCanvas.height = img.height * scale

            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
            let lines = getLines()
            lines.forEach(function(line, lineIdx) {
                drawText(line.txt, line.pos.x, line.pos.y, lineIdx)
            });
        }
    }
}

function resizeCanvas() {
    const elContainer = document.querySelector('.meme-container');

    let dis = (getComputedStyle(elContainer, null).display)
    if (dis === 'none') return

    let minSize = Math.min(elContainer.offsetWidth, elContainer.offsetHeight)
    if (elContainer.offsetWidth > gCanvasWidth) return
    gCanvas.width = minSize;
    gCanvas.height = minSize;
    render()
}

function drawRect(x, y, txtHeight, textLength) {
    gCtx.beginPath()
    gCtx.rect(x, y - txtHeight * 0.9, textLength * 1.05, txtHeight)
    gCtx.strokeStyle = '#000000'
    gCtx.stroke()
}

function drawText(txt, x, y, lineIdx) {
    console.log('im')
    let currLine = getCurrLineIdx()
    gCtx.lineWidth = 2
    gCtx.strokeStyle = getStrokeColor(lineIdx);
    gCtx.fillStyle = getColor(lineIdx)
    gCtx.font = getSize(lineIdx) + 'px ' + getFont(lineIdx);
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y)
    gCtx.save();
    if (!gIsDownload && lineIdx === currLine) {
        let pos = getCurrLinePos(lineIdx)
        let textLength = gCtx.measureText(txt).width
        drawRect(pos.x, pos.y, pos.size, textLength)
    }
}

function onAlignLeft() {
    alignLeft()
    render()
}

function onAlignCenter() {
    alignCenter()
    render()
}

function onAlignRight() {
    alignRight()
    render()
}

function onNewLine() {
    addNewLine('new Text')
    renderLinePref()
    render()
}

function onAddSticker(sticker) {
    addNewLine(sticker)
    render()
}

function onText() {
    addLine(gInput.value)
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

function onSaveMeme() {
    saveMeme()
    toggleModal()
}

function toggleModal() {
    document.querySelector('.modal').style.display = 'block'
}

function onCloseModal() {
    document.querySelector('.modal').style.display = 'none'

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
    gIsDownload = true

    //Draw without lines around
    let img = new Image()
    let imgId = getImgId();
    img.src = getImgById(+imgId).url
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    let lines = getLines()
    lines.forEach(function(line, lineIdx) {
        drawText(line.txt, line.pos.x, line.pos.y, lineIdx)
    });

    const data = gCanvas.toDataURL()
    elLink.href = data
    gIsDownload = false
}