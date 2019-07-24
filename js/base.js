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

async function changeSchool(key) {
  var exists = await schoolExists(key);
  if(exists) {
    localStorage.setItem('school', key);
    rcf.school = key;
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

function schoolExists(key) {
  return new Promise((resolve, reject) => {
    httpGet('/api/schedule.php?exists='+key).then((response) => {
      resolve(JSON.parse(response).exists);
    }).catch((e) => {
      reject(e);
    })
  })
}


const delay = ms => new Promise(res => setTimeout(res, ms));


async function insertNews() {
  if($('#news-container').length > 0) {
    var news = await httpGet('https://astrophoenix.com/~aiden/api/rmf/news.html');
    news = news.replace('<script', '&ltscript');
    news = news.replace('</script', '&lt/script');

    news = news.replace('<link', '&ltlink');
    news = news.replace('</link', '&lt/link');

    $('#news-container').html(news);
  }
}

setInterval(insertNews, 300e3);