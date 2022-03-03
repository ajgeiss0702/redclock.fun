<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>

    <meta charset="utf-8">
    <title>Countdowns</title>
    <link rel='stylesheet' id='theme-changer' href='/css/themes/<?php
    if(isset($_COOKIE['theme'])) {
      echo($_COOKIE['theme']);
    } else {
      echo('light');
    }
    ?>.css?r=1'>

    <script src="/js/jquery.min.js"></script>

    <link rel='stylesheet' href='/css/base.css?r=3'>

  </head>
  <body>
    <div id="container" class="center"></div>
  </body>
  <script type="text/javascript">
  async function main() {
    var raw = await httpGet("/api/schedule.php?school=list");
    var schools = JSON.parse(raw);

    console.log(schools)

    var adding = "";

    for(var schoolName in schools) {
      if (schools.hasOwnProperty(schoolName)) {
        var school = schools[schoolName];
        if(school.schedules == null) continue;

        for (var schedule in school.schedules) {
          if (school.schedules.hasOwnProperty(schedule)) {
            adding += `
            <div class="layout card" style="width: 25vw;"'>
              <iframe src='/?school=`+schoolName+`&schedule=`+schedule+`&layout=countdown' class='countdown-iframe card-img-top'></iframe>
              <div class="card-body" style="height:2em;">
                <p class="card-text">`+school.display+` - `+school.schedules[schedule]+`</p>
              </div>
            </div>`
          }
        }
        adding += `<br><br>`;
      }
    }

    $("#container").html(adding);
  }
  setTimeout(main, 1e3)



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
  </script>
</html>
