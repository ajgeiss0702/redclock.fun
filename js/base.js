function httpGet(url, callback = false) {
  if(!callback) {
    return new Promise((resolve, reject) => {
      var xmlhttp = new XMLHttpRequest();
      try {
        xmlhttp.onreadystatechange = function() {
          if(xmlhttp.readyState == 4 && xmlhttp.responseText !== 24) {
            console.debug("[httpGet] xmlhttp: %o", xmlhttp)
            if(xmlhttp.status == 0) {
              reject(new Error("Network error occured"))
            }
            resolve(xmlhttp.responseText);
          }
        };
        xmlhttp.onerror = () => {
          if(xmlhttp.readyState == 4) {
            reject(new Error("Unknown error occured"));
          }
        };
        xmlhttp.onabort = () => {
          if(xmlhttp.readyState == 4) {
            reject(new Error("Request aborted"));
          }
        };
        xmlhttp.ontimeout = () => {
          if(xmlhttp.readyState == 4) {
            reject(new Error("Request timed out"));
          }
        }
        xmlhttp.open("get", url, true);
        xmlhttp.send();
      } catch(e) {
        reject(e);
      }
    })
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState == 4 && xmlhttp.responseText !== 24) {
        callback(xmlhttp.responseText);
      } else if(xmlhttp.readystate == 4) {
        console.error("Failed to get '" + url + "'! ("+xmlhttp.readyState+")");
      }
    };
    xmlhttp.open("get", url, true);
    xmlhttp.send();
  }
}

function caps(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function _GET(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

async function changeSchool(key) {
  var exists = await schoolExists(key);
  if(exists) {
    localStorage.setItem('school', key);
    rcf.school = key;
  } else {
    console.log("invalid school")
  }
}


function reload_js(src, nore = false) {
  try {
    var p = $('head')[0];
    $('script[src="' + src + '"]').remove();
    if(!nore) {
      var script = document.createElement('script');
      var sched = localStorage.getItem('schedule')
      script.src = src;
      p.appendChild(script);
      console.debug("Loading script: " + src);
    }
  } catch(error) {
    console.error(errer);
  }
}

function changeSchedule(key) {
  localStorage.setItem('schedule', key);
  rcf.schedule = key;
}

function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const delay = ms => new Promise(res => setTimeout(res, ms));


function copy(v) {
  switch (typeof v) {
    case 'object':
      return JSON.parse(JSON.stringify(v));
    case 'string':
      return new String(v).toString();
    case 'number':
      return Number(new Number(v));
    default:
      var tmp = [v];
      return JSON.parse(JSON.stringify(tmp))[0];
  }
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setFullYear(9999);
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getBase64(file) {
  return new Promise((resolve, reject) => {
    console.debug("[getBase64] file: %o", file)
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  })
}


setTimeout(() => {
  rcf.on('load', () => {
    if(typeof moment == "function") {
      setInterval(updateMoments, 1e3);
    }
  })
}, 100)

async function updateMoments() {
  $('.moments').each((i) => {
    var t = $($(".moments")[i])
    var ms = t.attr("data-ms");
    if(typeof ms != "string" && typeof ms != "number") {
      console.log("[moments] "+typeof ms);
      return;
    }
    if(typeof ms != "number") {
      ms = Number(ms);
    }
    t.text(moment(ms).fromNow());
  })
}
