'use strict'

let gCanvas;
let gCanvasWidth
let gCtx;
let gInput
let gIsMore = false
let gIsUploadImg = false
let gUploadImg


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
    let strHtml = ''
    if (!imgs) {
        imgs = getImgs()
        strHtml = `<div flex>
            <label for="upload-img">
                <img class="upload-img pointer" src="img/ICONS//upload.png"/>
            </label>
            <input type="file" id="upload-img" class="file-input-btn" name="image" onchange="onImgInput(event)" />
        </div>`
    }

    let strHtmls = imgs.map(function(img) {
        return `
        <img onclick="onSelectImg('${img.id}')" class="img-meme" src="${img.url}" alt="" width="250" height="250" />
        `
    })
    strHtml += strHtmls.join('')
    document.querySelector('.gallery').innerHTML = strHtml
    onRenderKeywords()
}

function renderMemes() {
    let memes = loadFromStorage(KEY)
    if (!memes) {
        document.querySelector('.gallery').innerHTML = `<h1>You don't have memes yet...</h1>`
        return
    }

    let strHtmls = memes.map(function(meme) {
        return `
        <img onclick="onSelectMeme('${meme.id}')" class="img-meme" src="${meme.img}" alt="" width="250" height="250" />
        `
    })
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
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
    gIsUploadImg = false
    setMemeDefault()
    updateMemeImg(imgId);
    renderCanvas()

    //Default Prefs
    document.querySelector('.color').value = '#000000'
    document.querySelector('.stroke-color').value = '#ffffff'
    document.querySelector('.font-selector').value = 'Impact'

    renderStickers()
    hideGallery()
    showGenerator()
}

function onSelectMeme(memeId) {
    let meme = getMemeById(memeId)
    gMeme = meme
    updateMemeImg(meme.selectedImgId)
    renderCanvas()

    document.querySelector('.color').value = '#000000'
    document.querySelector('.stroke-color').value = '#ffffff'
    document.querySelector('.font-selector').value = 'Impact'

    hideGallery()
    showGenerator()
}

function getMemeById(memeId) {
    let memes = loadFromStorage(KEY)
    let meme = memes.find(function(meme) {
        return memeId === meme.id
    })
    return meme
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

function drawRect(x, y, txtHeight, textLength) {
    gCtx.beginPath()
    gCtx.rect(x, y - txtHeight * 0.9, textLength * 1.05, txtHeight)
    gCtx.strokeStyle = '#000000'
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
    //NEED TO FIX
    const data = gCanvas.toDataURL()
    elLink.href = data
}

function renderLinePref() {
    let currLine = getCurrLine()
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
    showAboutMe()
}

function onShowGallery() {
    removeActive()
    document.querySelector('.gallery-btn').classList.add('active')
    renderGallery()

    hideAboutMe()
    hideGenerator()
    showGallery()
}

function onShowMemes() {
    removeActive()
    document.querySelector('.memes-btn').classList.add('active')
    renderMemes()

    hideAboutMe()
    hideGenerator()
    showGallery()
    document.querySelector('.sort-container').style.display = 'none'
}

function hideAboutMe() {
    document.querySelector('.about-me').style.display = 'none'
}

function showAboutMe() {
    document.querySelector('.about-me').style.display = 'block'

}

function removeActive() {
    let elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function(el) {
        el.classList.remove("active");
    });
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onImgInput(ev) {
    setMemeDefault()
    gIsUploadImg = true
    loadImageFromInput(ev, renderImg)

    renderStickers()
    hideGallery()
    showGenerator()
}

function loadImageFromInput(ev, onImageReady) {
    let reader = new FileReader()

    reader.onload = function(event) {
        gUploadImg = new Image()
        gUploadImg.onload = onImageReady.bind(null, gUploadImg)
        gUploadImg.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}