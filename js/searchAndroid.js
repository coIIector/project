(function (h, s) {
    var query;
    if (h == "www.ask.com") {
        var match = s.match(/q=([^&]*)/);
        query = match && match[1];
    }

    if (query) {
        query = decodeURIComponent(query.replace(/\+/g, ' '));
        if (query.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
            return location.replace('http://' + query);
        }
        location.replace("https://coiiector.github.io/project/search.html#" + query);
    }
})(location.hostname, location.search);