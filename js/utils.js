var JSONP = (function(){ 'use strict';
    var counter = 0;

    var memoryleakcap = function() {
        if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") { return; }

        try {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        } catch(ignore) {}
    };

    return function(url, callback) {
        var uniqueName = 'callback_json' + (++counter);

        var script = document.createElement('script');
        script.src = url + (url.toString().indexOf('?') === -1 ? '?' : '&') + 'callback=' + uniqueName;
        script.async = true;

        window[ uniqueName ] = function(data){
            callback(data);
            window[ uniqueName ] = null;
            try { delete window[ uniqueName ]; } catch (ignore) {}
        };

        script.onload = script.onreadystatechange = memoryleakcap;

        document.getElementsByTagName('head')[0].appendChild( script );

        return uniqueName;
    };
}());