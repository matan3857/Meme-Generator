'use strict'

var gMeme

function setMemeDefault() {
    gMeme = {
        // selectedImgId: 0,
        selectedLineIdx: 0,
        lines: [{
                pos: { x: 50, y: 50 },
                txt: 'I never eat Falafel',
                size: 20,
                align: 'left',
                color: 'red',
                strokeColor: 'black',
                font: 'Arial'
            },
            {
                pos: { x: 50, y: 150 },
                txt: 'I never eat Shawarma',
                size: 50,
                align: 'left',
                color: 'blue',
                strokeColor: 'black',
                font: 'Arial'
            }
        ]
    }
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



function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++

}


function updateMemeImg(imgId) {
    gMeme.selectedImgId = imgId
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
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function makeLine(txt) {
    return {
        pos: { x: 50, y: 250 },
        txt,
        size: 40,
        align: 'left',
        color: 'white',
        strokeColor: 'black',
        font: 'Arial'
    }
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