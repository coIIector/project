var h=window.location.hash,i=h.indexOf(" "),s;window.location=1<i&&(s=localStorage.getItem("search:"+h.slice(1,i)))&&s.replace(/\{ARG}/g,h.slice(i+1))||"searchSetup.html"+h;