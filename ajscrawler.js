var ajscrawler = function ajscrawler(readyStateChangeHandler, document) {
    if (!document) document = window.document;
    var getlinks = function (document) {
        var atags = document.querySelectorAll("a");
        var links = [];
        var i = 0;
        var tmpstr = "";
        var tmparr = [];
        var rex = /([^#]+)/;
        for (i = 0; i < atags.length; ++i) {
            tmpstr = atags[i].href;
            tmparr = rex.exec(atags[i].href);
            if (!tmparr || tmparr.length == 0) { /*don't care about current page with different #blabla ..*/
                continue;
            }
            tmpstr = tmparr[0];
            if (links.indexOf(tmpstr) != -1) { /*don't want duplicates.*/
                continue;
            }
            links.push(tmpstr);
            continue;
        };
        return links;
    };
    var links = getlinks(document);

    var xhr = null;
    var i = 0;
    for (i = 0; i < links.length; ++i) {
        try{
        xhr = new XMLHttpRequest();
        xhr.open("GET", links[i], true);
        xhr.addEventListener("readystatechange", readyStateChangeHandler);
        xhr.send();
        xhr.x_send_time = Date.now();
        xhr.x_url = links[i];
        }catch(ex){
            console.log("warning: ignoring url "+links[i].toString(),ex.toString());
        }
    }
    return true;
};


ajscrawler(
    function (ev) {
        var xhr = ev.target;
        var maxSize = 10 * 1024 * 1024;
        if (Number(xhr.getResponseHeader("Content-length")) >= maxSize || xhr.responseText.length >= maxSize) {
            xhr.abort();
        } else
        if (xhr.readyState != xhr.DONE) {
            return;
        }
        //okay we're ready..
        var text = xhr.responseText;
        if (/kittens/.test(text)) {
            console.log("found kittens!", xhr.x_url);
        }

    }
);
