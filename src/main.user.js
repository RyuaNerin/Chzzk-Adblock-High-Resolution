// ==UserScript==
// @name         치지직 - 그리드 우회 & 광고 제거
// @namespace    http://tampermonkey.net/
// @description  치지직 그리드를 우회하여 1080p를 언락하고, 광고를 스킵해주는 메크로 (기여자 : hui1601)
// @author       Nikuname, Clrain
// @version      1.0.1
// @match        https://chzzk.naver.com/live/*
// @match        https://chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @updateURL    https://github.com/nikuname/Chzzk-Adblock-High-Resolution/raw/main/src/main.user.js
// @downloadURL  https://github.com/nikuname/Chzzk-Adblock-High-Resolution/raw/main/src/main.user.js
// @grant        none
// ==/UserScript==

(function(){
    const nativeXMLHttpRequest = window.XMLHttpRequest;
    XMLHttpRequest = function(){
        this.eventlisteners = {};
        const xhr = new nativeXMLHttpRequest();
        this.xhr = xhr;
        let keys = ['readyState', 'response', 'responseText', 'responseType', 'responseURL', 'responseXML', 'status', 'statusText', 'timeout', 'upload', 'withCredentials'];
        for(let key of keys){
            Object.defineProperty(this, key, {
                get: function(){
                    const apiRegex = /https:\/\/api.chzzk.naver.com\/service\/v3\/channels\/[a-z0-9]+\/live-detail/;
                    const responseURL = xhr.responseURL;
                    if(key === 'responseText' && xhr.responseType == '' && responseURL && apiRegex.test(responseURL)){
                        try{
                            let res = JSON.parse(xhr.response);
                            res.content.p2pQuality = [];
                            return JSON.stringify(res);
                        } catch(e){
                            console.error(e);
                        }
                    }
                    if(key === 'responseText' && xhr.responseType == '' && responseURL)
                    {
                        let res = JSON.parse(xhr.response);
                        if(res.ads) {
                            res.ads = [];
                            return JSON.stringify(res);
                        }
                    }

                    return xhr[key];
                },
                set: function(value){
                    xhr[key] = value;
                }
            });
        }
        function eventHandlerWrapper(t, eventType){
            return function(e) {
                if(t.eventlisteners[eventType]){
                    for(let listener of t.eventlisteners[eventType]){
                        if(!listener)
                            continue;
                        try{
                            listener.apply(t, e);
                        }catch(e){}
                    }
                }
            };
        }
        let eventTypes = ['load', 'error', 'progress', 'abort', 'loadend', 'loadstart', 'timeout', 'readystatechange'];
        for(let eventType of eventTypes){
            xhr.addEventListener(eventType, eventHandlerWrapper(this, eventType));
        }
        return this;
    };
    XMLHttpRequest.prototype.addEventListener = function(type, listener){
        if(!(type in this.eventlisteners)){
            this.eventlisteners[type] = [];
        }
        this.eventlisteners[type].push(listener);
    };
    XMLHttpRequest.prototype.open = function(method, url, async){
        this.url = url;
        this.xhr.open(method, url, async);
    };
    XMLHttpRequest.prototype.send = function(){
        this.xhr.send();
    };
    XMLHttpRequest.prototype.setRequestHeader = function(header, value){
        this.xhr.setRequestHeader(header, value);
    };
    XMLHttpRequest.prototype.getAllResponseHeaders = function(){
        return this.xhr.getAllResponseHeaders();
    };
    XMLHttpRequest.prototype.getResponseHeader = function(header){
        return this.xhr.getResponseHeader(header);
    };
    XMLHttpRequest.prototype.abort = function(){
        this.xhr.abort();
    };
    XMLHttpRequest.prototype.overrideMimeType = function(mime){
        this.xhr.overrideMimeType(mime);
    };
    let properties = ['onload', 'onerror', 'onprogress', 'onabort', 'onloadend', 'onloadstart', 'ontimeout', 'onreadystatechange'];
    for(let property of properties){
        Object.defineProperty(XMLHttpRequest.prototype, property, {
            set: function(value){
                this.addEventListener(property.slice(2), value);
            }
        });
    }
})();