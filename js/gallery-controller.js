'use strict'

let gIsMore = false
let gIsUploadImg = false

function renderGallery(imgs = '') {
    let strHtml = `<div class="upload-container">
    <label for="upload-img">
        <img class="upload-img pointer" src="img/ICONS//upload.png"/>
    </label>
    <input type="file" id="upload-img" class="file-input-btn" name="image" onchange="onImgInput(event)" />
    </div>`
    if (!imgs) {
        imgs = getImgs()
    }

    let strHtmls = imgs.map(function(img) {
        return `
        <img onclick="onSelectImg('${img.id}')" class="img-meme" src="${img.url}" alt="" width="230" height="230" />
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
        <img onclick="onSelectMeme('${meme.id}')" class="img-meme" src="${meme.img}" alt="" width="230" height="230" />
        `
    })
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
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
    document.querySelector('.font-selector').style.fontFamily = 'Impact'

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
    document.querySelector('.font-selector').style.fontFamily = 'Impact'

    hideGallery()
    showGenerator()
}

function onMore() {
    gIsMore = !gIsMore
    onRenderKeywords(gIsMore)
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

function onImgInput(ev) {
    setMemeDefault()
    gIsUploadImg = true
    loadImageFromInput(ev, renderImg)

    renderStickers()
    hideGallery()
    showGenerator()
}