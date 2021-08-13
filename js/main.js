'use strict'

var gCanvas;
var gCanvasWidth
var gCtx;
var gInput
var gIsMore = false



function init() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gInput = document.querySelector('[name=txt]')
    gInput.addEventListener('input', onText)
    renderGallery()
    onRenderKeywords()

    gCanvasWidth = gCanvas.width
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
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

function renderGallery(imgs = '') {
    if (!imgs) {
        imgs = getImgs()
    }
    let strHtmls = imgs.map(function(img) {
        return `
        <img onclick="onSelectImg('${img.id}')" class="img-meme" src="${img.url}" alt="" width="250" height="250" />
        `
    })
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
    onRenderKeywords()
}

function onSortImages(searchWord = '') {
    if (!searchWord) searchWord = document.querySelector('[name=sort-txt]').value
    if (!searchWord) return
    let imgsForDisplay = getImgsForDisplay(searchWord)
    document.querySelector('.sort-txt').value = ''
    renderGallery(imgsForDisplay)
    if (!imgsForDisplay.length) return
    onRenderKeywords()
}


function onRenderKeywords(isMore = false) {
    let keywords = getKeywords()
    let strHtml = ''
    let idx = 0
    for (let keyword in keywords) {
        let fontSize = 16 + keywords[keyword]
        if (fontSize > 60) fontSize = 60;
        strHtml += `<button onclick="onSortImages('${keyword}')" class="sort-btns ${keyword} pointer" style="border: none;text-decoration: none;font-size:${fontSize}px">${keyword}</button>`
        idx++
        if (isMore) continue
        if (idx === 5) {
            break;
        }
    }

    strHtml += `<button onclick="onMore()" class="sort-btns pointer" style="text-decoration: underline;">`

    if (!isMore) strHtml += `more...</button><div class="search-more"></div>`
    else strHtml += `less...</button><div class="search-more"></div>`
    document.querySelector('.btns-search').innerHTML = strHtml
}



function onSelectImg(imgId) {
    setMemeDefault()
    updateMemeImg(imgId);
    renderCanvas()

    //Default Prefs
    document.querySelector('.color').value = 'black'
    document.querySelector('.stroke-color').value = '#ffffff'
    document.querySelector('.font-selector').value = 'Impact'


    hideGallery()
    showGenerator()
}


function renderCanvas() {
    let img = new Image()
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
        let textLength = gCtx.measureText(txt).width
        drawRect(pos.x, pos.y, pos.size, textLength)
    }
}

function onMore() {
    gIsMore = !gIsMore
    onRenderKeywords(gIsMore)
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
    alert('Saved')
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
    console.log('currLine.color', currLine.color)


    document.querySelector('.color').value = currLine.color
    document.querySelector('.stroke-color').value = currLine.strokeColor
    document.querySelector('.font-selector').value = currLine.font
    document.querySelector('[name=txt]').value = currLine.txt
}


function onAboutMe() {
    removeActive()
    document.querySelector('.about-me-btn').classList.add('active')

    hideGenerator()
    hideGallery()
    hideMyMemes()
    showAboutMe()
}



function onShowGallery() {
    removeActive()
    document.querySelector('.gallery-btn').classList.add('active')
    renderGallery()

    hideAboutMe()
    hideGenerator()
    hideMyMemes()
    showGallery()
}

function onShowMemes() {
    removeActive()
    document.querySelector('.memes-btn').classList.add('active')

    hideAboutMe()
    hideGenerator()
    hideGallery()
    showMyMemes()
}

function hideMyMemes() {
    document.querySelector('.my-memes-gallery').style.display = 'none'
}

function hideAboutMe() {
    document.querySelector('.about-me').style.display = 'none'
}

function showMyMemes() {
    document.querySelector('.my-memes-gallery').style.display = 'block'
}

function showAboutMe() {
    document.querySelector('.about-me').style.display = 'block'

}

function removeActive() {
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function(el) {
        el.classList.remove("active");
    });
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}