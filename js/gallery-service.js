'use strict'
var gKeywords = { 'happy': 25, 'baby': 13, 'funny': 7, 'dog': 6, 'crazy': 12, 'kiss': 3, 'cat': 3, 'putin': 2 }
let gUploadImg

var gImages = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog'] },
    { id: 3, url: 'img/3.jpg', keywords: ['dog', 'baby', 'sleep', 'funny'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby', 'happy'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny', 'happy'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'baby', 'crazy', 'happy'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'obama', 'happy'] },
    { id: 11, url: 'img/11.jpg', keywords: ['kiss'] },
    { id: 12, url: 'img/12.jpg', keywords: ['haim'] },
    { id: 13, url: 'img/13.jpg', keywords: ['leonardo', 'dicaprio', 'happy'] },
    { id: 14, url: 'img/14.jpg', keywords: ['crazy'] },
    { id: 15, url: 'img/15.jpg', keywords: ['funny', 'happy'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'happy'] },
    { id: 17, url: 'img/17.jpg', keywords: ['putin'] },
    { id: 18, url: 'img/18.jpg', keywords: ['toy', 'story', 'funny', 'worry'] },
];


function getImgs() {
    return gImages
}

function getKeywords() {
    return gKeywords
}

function getImgsForDisplay(searchWord) {
    let lowerCaseWord = searchWord.toLowerCase()
    let imgsForDisplay = gImages.filter(function(img) {
        return img.keywords.includes(lowerCaseWord)
    })
    if (imgsForDisplay.length) addSearchWord(lowerCaseWord);
    return imgsForDisplay
}

function addSearchWord(searchWord) {
    if (gKeywords[searchWord]) gKeywords[searchWord]++
        else gKeywords[searchWord] = 1
}

function hideGallery() {
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.sort-container').style.display = 'none'
}

function hideGenerator() {
    document.querySelector('.meme-container').style.display = 'none'
}

function showGallery() {
    document.querySelector('.gallery-container').style.display = 'block'
    document.querySelector('.sort-container').style.display = 'block'

}

function showGenerator() {
    document.querySelector('[name=txt]').value = ''
    document.querySelector('.meme-container').style.display = 'block'
}

function getImgById(imgId) {
    const img = gImages.find(function(img) {
        return imgId === img.id
    })
    return img
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
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