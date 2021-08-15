'use strict'
const KEY = 'memeDB';
let gMeme
let gMemes = loadFromStorage(KEY) ? loadFromStorage(KEY) : []
let gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
let gStickers = ['😎', '😭', '😍', '😂', '🤑', '🥳', '🤫']
let gCurrSticker = 0

function makeLine(txt) {
    return {
        pos: { x: 175, y: 250 },
        txt,
        size: 40,
        align: 'left',
        color: '#FFFFFF',
        strokeColor: '#000000',
        font: 'Impact',
        isDrag: false
    }
}

function setMemeDefault() {
    gMeme = {
        id: makeId(),
        selectedLineIdx: 0,
        lines: []
    }
}

function renderLinePref() {
    let currLine = getCurrLine()
    document.querySelector('.color').value = currLine.color
    document.querySelector('.stroke-color').value = currLine.strokeColor
    document.querySelector('.font-selector').value = currLine.font
    document.querySelector('[name=txt]').value = currLine.txt
}

function getCurrLineIdx() {
    return gMeme.selectedLineIdx
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getCurrLinePos(lineIdx) {
    let x = gMeme.lines[lineIdx].pos.x
    let y = gMeme.lines[lineIdx].pos.y
    let size = gMeme.lines[lineIdx].size
    return { x, y, size }
}


function getMemeById(memeId) {
    let memes = loadFromStorage(KEY)
    let meme = memes.find(function(meme) {
        return memeId === meme.id
    })
    return meme
}

function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++

}

function updateMemeImg(imgId) {
    gMeme.selectedImgId = imgId
}

function alignLeft() {
    gMeme.lines[gMeme.selectedLineIdx].pos.x = 0;
}

function alignCenter() {
    let textLength = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width
    gMeme.lines[gMeme.selectedLineIdx].pos.x = (gCanvas.width - textLength) / 2;
}

function alignRight() {
    let textLength = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width
    let pos = gCanvas.width - textLength
    gMeme.lines[gMeme.selectedLineIdx].pos.x = pos;
}

function getImgId() {
    return gMeme.selectedImgId;
}

function getLines() {
    return gMeme.lines
}

function getColor(lineIdx) {
    return gMeme.lines[lineIdx].color
}

function getStrokeColor(lineIdx) {
    return gMeme.lines[lineIdx].strokeColor
}

function getFont(lineIdx) {
    return gMeme.lines[lineIdx].font
}

function getSize(lineIdx) {
    return gMeme.lines[lineIdx].size
}

function addNewLine(txt) {
    gMeme.lines.push(makeLine(txt))
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addLine(txt) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getLineDown() {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += 10
}

function getLineUp() {
    gMeme.lines[gMeme.selectedLineIdx].pos.y -= 10
}

function getLineRight() {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += 10
}

function getLineLeft() {
    gMeme.lines[gMeme.selectedLineIdx].pos.x -= 10
}

function plusSize() {
    gMeme.lines[gMeme.selectedLineIdx].size += 10
}

function minusSize() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 10
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = 0
}

function setColorFill(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function setColorStroke(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
}

function changeFont(newFont) {
    gMeme.lines[gMeme.selectedLineIdx].font = newFont
}

//For my memes saving
function saveMeme() {
    gMeme.img = gCanvas.toDataURL()
        // Make new id if we have same imgs
    gMeme.id = makeId()
    gMemes.push(JSON.parse(JSON.stringify(gMeme)))
    _saveMemesToStorage()
}

function _saveMemesToStorage() {
    saveToStorage(KEY, gMemes)
}

//Grab Lines on Canvas functions
function onGrabDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    setLineDrag(true)
    gStartPos = pos
    let elCanvas = document.querySelector('.meme-container')
    elCanvas.style.cursor = 'grabbing'
}

function isLineClicked(clickedPos) {
    const { pos } = gMeme.lines[gMeme.selectedLineIdx]
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width
}


function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function onGrabMove(ev) {
    const line = getCurrLine();
    if (!line) return
    if (line.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - line.pos.x
        const dy = pos.y - line.pos.y
        moveCurrLine(dx, dy)
        gStartPos = pos
        renderCanvas()
    }
}

function onGrabUp() {
    setLineDrag(false)
    let elCanvas = document.querySelector('.meme-container')
    elCanvas.style.cursor = 'grab'
}

function moveCurrLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

//Stickers

function renderStickers() {
    let strHtml = ''
    for (let i = gCurrSticker; i < (gCurrSticker + 4); i++) {
        if (gStickers.length <= i) break
        strHtml += `<button class="meme-btns meme-sticker-btns" onclick="onAddSticker('${gStickers[i]}')">${gStickers[i]}</button>`
    }
    document.querySelector('.curr-stickers').innerHTML = strHtml
}

function onNextStickers(val) {
    if (val) {
        if (gStickers.length < gCurrSticker + 4) return
        gCurrSticker += 4
    } else {
        gCurrSticker -= 4
        if (gCurrSticker < 0) gCurrSticker = 0
    }
    renderStickers()
}


//Share on Facebook

function uploadImg() {
    const imgDataUrl = gCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
        window.open(url)
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}