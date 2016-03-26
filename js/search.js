var h=window.location.hash,i,s;
if(h.match(/^#[a-zA-Z0-9]+\+/))h=h.replace(/\+/g,' ');
h=decodeURIComponent(h);
i=h.indexOf(" ");window.location=i>1&&(s=localStorage.getItem("search:"+h.slice(1,i)))&&s.replace(/\{ARG}/g,encodeURIComponent(h.slice(i+1)))||(s=localStorage.getItem("search:DEFAULT"))&&s.replace(/\{ARG}/g,encodeURIComponent(h.slice(1)))||"searchSetup.html"+h;