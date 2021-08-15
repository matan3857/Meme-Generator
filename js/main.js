'use strict'

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