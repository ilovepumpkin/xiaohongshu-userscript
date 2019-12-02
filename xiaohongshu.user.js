// ==UserScript==
// @name         xiaohongshu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.xiaohongshu.com/discovery/item/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const titleElem = document.querySelector("h1[class='title']");
    const title = titleElem && titleElem.textContent
    function createButton(btnText, parent) {
        const btn = document.createElement("input")
        btn.value = btnText
        btn.type = "button"
        parent.appendChild(btn)
        return btn;
    }

    function downloadImage(rawUrl, idx) {
        const url = "https://" + rawUrl.replace('url("//', '').replace(/\?.*/, '')
        let fileName = title ? title + "-" + idx : url.substring(url.lastIndexOf("/") + 1)
        fileName = fileName + ".jpg"
        downloadUrlFile(url, fileName)
    }

    function downloadVideo(rawUrl) {
        let fileName = title ? title : rawUrl.substring(rawUrl.lastIndexOf("/") + 1, rawUrl.indexOf("?"))
        fileName = fileName + ".mp4"
        downloadUrlFile(rawUrl.replace("http", "https"), fileName)
    }

    function downloadUrlFile(url, fileName) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                save(fileName, xhr.response)
            }
        };

        xhr.send();
    }

    function save(name, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        save_link.click();
    }

    const leftCard = document.querySelector("div[class='left-card']")
    const btnContainer = document.createElement("div")
    leftCard.insertBefore(btnContainer, leftCard.firstChild)

    const video = document.querySelector("video");

    if (video) {
        btnContainer.style = "display:flex;justify-content:center;padding:0px 100px 20px;"
        const btnVideo = createButton("下载视频", btnContainer)
        btnVideo.onclick = function () {
            downloadVideo(video.src)
        }
    } else {
        btnContainer.style = "display:flex;justify-content:space-between;padding:0px 100px 20px;"
        const slide = document.querySelector("ul[class='slide']")

        const btnBigView = createButton("看大图", btnContainer)
        btnBigView.onclick = function () {
            let current;
            let idx;
            slide.querySelectorAll("li").forEach((x, index) => { if (x.style.display !== 'none') { current = x; idx = index + 1 } })
            const url = "https://" + current.firstChild.style["background-image"].replace('url("//', '').replace(/\?.*/, '')
            window.open(url, "_blank")
        }

        const btnCurrent = createButton("下载", btnContainer)
        btnCurrent.onclick = function () {
            let current;
            let idx;
            slide.querySelectorAll("li").forEach((x, index) => { if (x.style.display !== 'none') { current = x; idx = index + 1 } })
            downloadImage(current.firstChild.style["background-image"], idx)
        }

        const btnAll = createButton("全部下载", btnContainer)
        btnAll.onclick = function () {
            document.querySelector("ul[class='slide']").querySelectorAll("span").forEach((x, idx) => {
                downloadImage(x.style["background-image"], idx + 1)
            })
        }

    }
})();