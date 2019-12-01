// ==UserScript==
// @name         xiaohongshu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.xiaohongshu.com/discovery/item/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createButton(btnText,parent){
      const btn=document.createElement("input")
      btn.value=btnText
      btn.type="button"
      parent.appendChild(btn)
      return btn;
    }


    function downloadUrlFile(rawUrl,idx) {
        const title=document.querySelector("h1[class='title']").textContent
        const url="https://"+rawUrl.replace('url("//','').replace(/\?.*/,'')
        const fileName=title+"-"+idx+".jpg"
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                // 获取图片blob数据并保存
                //saveAs(xhr.response, 'abc.jpg');
                save(fileName,xhr.response)
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

    const slide=document.querySelector("ul[class='slide']")
    const leftCard=document.querySelector("div[class='left-card']")
    const btnContainer=document.createElement("div")
    btnContainer.style="display:flex;justify-content:space-between;padding:0px 100px 20px;"
    leftCard.insertBefore(btnContainer,leftCard.firstChild)

    const btnAll=createButton("下载全部",btnContainer)
    btnAll.onclick=function(){
       document.querySelector("ul[class='slide']").querySelectorAll("span").forEach((x,idx)=>{
             downloadUrlFile(x.style["background-image"],idx+1)
       })
    }

    const btnCurrent=createButton("下载当前",btnContainer)
    btnCurrent.onclick=function(){
       let current;
       let idx;
       slide.querySelectorAll("li").forEach((x,index)=>{if(x.style.display!=='none'){current=x;idx=index+1}})
       downloadUrlFile(current.firstChild.style["background-image"],idx)
    }

    const btnBigView=createButton("看大图",btnContainer)
    btnBigView.onclick=function(){
       let current;
       let idx;
       slide.querySelectorAll("li").forEach((x,index)=>{if(x.style.display!=='none'){current=x;idx=index+1}})
       const url="https://"+current.firstChild.style["background-image"].replace('url("//','').replace(/\?.*/,'')
       window.open(url,"_blank")
    }
})();