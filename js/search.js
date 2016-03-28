var h = window.location.hash, i, s, l, k;
if (h.match(/^#[a-zA-Z0-9]+\+/))h = h.replace(/\+/g, ' ');
h = decodeURIComponent(h);
i = h.indexOf(" ");
l = i > 1 && (s = localStorage.getItem("search:" + h.slice(1, i))) && s.replace(/\{ARG}/g, encodeURIComponent(h.slice(i + 1))) || (s = localStorage.getItem("search:DEFAULT")) && s.replace(/\{ARG}/g, encodeURIComponent(h.slice(1)));
if (l || localStorage.getItem('search:EXTERNAL') || !(k = window.location.search.slice(1)))window.location = l || "searchSetup.html" + h; else {
    window.loadFromJson = function (data) {
        $.each(data, function (key, value) {
            localStorage.setItem('search:' + key, value);
            location.reload();
        })
    };
    $.getScript(k);
}