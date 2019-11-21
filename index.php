<?php
if(isset($_GET['404'])) {
  die("<script>location.href='/?error=404&from='+encodeURIComponent(location.pathname)</script>");
}
if(isset($_GET['error'])) {
  if($_GET['error'] == "404" && ($_GET['from'] == "%2Fabout" || $_GET['from'] == "/about")) {
    die("<script>location.href='/#about'</script>");
  }
}
if($_SERVER['SERVER_NAME'] == "astrohub.us" || $_SERVER['SERVER_NAME'] == "www.astrohub.us") {
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: https://redclock.fun");
}
?>
<html>
  <head>
    <title>Red Clock - Bell Countdown</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <link rel='stylesheet' href='/css/base.css'>
    <link rel='stylesheet' href='/css/checkboxes.css'>

    <link rel='stylesheet' id='layout-changer' href='/css/layouts/<?php
    if(isset($_GET['layout'])) {
      echo($_GET['layout']);
    } else if(isset($_GET['rmtv'])) {
      echo("large");
    } else {
      if(isset($_COOKIE['layout'])) {
        echo($_COOKIE['layout']);
      } else {
        echo('default');
      }
    }
    ?>.css'>
    <link rel='stylesheet' id='theme-changer' href='/css/themes/<?php
    if(isset($_COOKIE['theme'])) {
      echo($_COOKIE['theme']);
    } else {
      echo('light');
    }
    ?>.css'>


    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106568388-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-106568388-2');
    </script>

    <script src='/js/countdown-utils.js?c=5' defer async></script>
    <script src="/js/jquery.min.js" defer></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
      defer
      ></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous"
      defer
      ></script>

      <script src="/js/base.js"></script>
      <script src="/js/settings.js" defer></script>
      <script src="/js/pageloader.js" defer></script>
      <script src="/js/weather.js" defer></script>
      <script src="/js/how_many_people.js" defer></script>
      <script src="/js/festive.js?r=2" defer async></script>


    <link rel='icon' type="image/png" href='/img/red_clock.png'>
  </head>


  <body onload="rcf.emit('load')">
    <div id='rmtv' class='hidden'>www.redclock.fun</div>
    <div id='load'></div>
    <div id='scheduleloaderror' class='errorbox hidden'>
      The schedule could not be loaded. Try again later.
    </div>
    <div id='dummy-ct' class='hidden' hidden></div>
    <div id='schoolselector-ct' class='content-container' style="display: none;"></div>
    <div id='countdown-ct' class='content-container'></div>
    <div id='about-ct' class='content-container'></div>
    <div id='stats-ct' class='content-container'></div>
    <div id='extensions-ct' class='content-container'></div>

    <div id="festive"></div>
  </body>



  <script>
  var rcf = {};
  rcf.on = function(name, func) {
    if(name == 'load' && rcf.loaded) {
      func();
      return;
    }
    this._subscriptions[name] = this._subscriptions[name] || [];
    this._subscriptions[name].push(func)
  }
  rcf.off = function(name, func){
    this._subscriptions[name] = this._subscriptions[name].filter(f=>f!==func)
  }
  rcf._subscriptions = {}
  rcf.emit = function(name, ...args){
    if(!this._subscriptions[name]){return; }
    this._subscriptions[name].forEach(f=>f(...args))
  }

  document.onkeyup = (e) => {
    rcf.emit("key-"+(e.keyCode || e.which));
  }

  rcf.theme = 'light';
  rcf.changeTheme = (theme) => {
    $('#theme-changer')[0].href = '/css/themes/'+theme.toLowerCase()+'.css?r=1';
    rcf.theme = theme;
    if(theme.toLowerCase() != "rmtv") {
      setCookie('theme', theme)
    }
    updateWeather();
  }

  var lastFocusTime = new Date();
  var lastHadFocus = true;
  setInterval(() => {
    if(!document.hasFocus()) {
      lastHadFocus = false;
    } else {
      if(!lastHadFocus || (lastFocusTime.getTime() < new Date().getTime()-5000)) {
        rcf.emit('focus');
      }
      lastHadFocus = true;
      lastFocusTime = new Date();
    }
  }, 2500)


  rcf.loaded = false;
  rcf.on('load', () => {
    rcf.loaded = true;
    if(_GET('rmtv') == "undefined") {
      document.getElementById('rmtv').classList = "rmtv-ad";
      $('body').css("background-color", "rgb(140, 0, 0)")
      $('.countdown-container').css("background-color", "rgba(0, 0, 0, 0) !important");
      rcf.changeTheme('rmtv')
    }
  });


  if(typeof localStorage.getItem('school') != 'undefined') {
    rcf.school = localStorage.getItem('school');
    rcf.schedule = localStorage.getItem('schedule');
  }

  httpGet('/api/schedule.php?school=list').then((a) => {
    try {
      rcf.schoolList = JSON.parse(a);
    } catch(e) {
      console.error(e);
      $('#scheduleloaderror').removeClass('hidden');
    }
  }).catch((e) => {
    console.error(e);
    $('#scheduleloaderror').removeClass('hidden');
    $('#scheduleloaderror').addClass('fadeIn');
  });

  var logotext = `
                \`.-:://////////::-.\`
           \`.://////:::////-:://////:.\`
        \`-:////:-.\`   \`///:    \`.-:////:-\`
      \`-///////-      \`///:      \`:///////-\`
     -////.\`:///\`     \`///-      .///- .////-
   \`////-    \`\`\`       :ys        \`\`\`    -////\`
  .////.               smm.               .////.
 .///////-             smm.     .oy+    .///////.
 ///:.-::\`             smm.   .odds-    .:/:.:///
-///\`                  smm. .odds-           \`///-
///:                   smm:odds-              :///
///-\`\`\`\`\`\`             smddds-          ......-///
//////////-            oo+syyyyyyyyyyyy+//////////
///:------\`             .//+/-.........\`......:///
///:                      .///.               :///
-///\`                       .///.            \`///-
 ///: .--.                    .///.     .::-.:///
 .////////                      .//-    .///////.
  .////-.                                 .////.
   \`////-               \`\`        \`\`     -////\`
     -////.  .:/:\`     -///\`     .///- .////-
      \`-////:///:\`     -///.     \`:///////-\`
        \`-://///-.\`    -///.   \`.-:////:-\`
           \`.://////::-:///::://////:.\`
               \`.-:://////////::-.\`               `; // the logo that is put in console

    console.log("%c"+logotext, "color:red;")
    console.log("%cRed Clock Bell Countdown", "color: red; font-size: 40px;")
    console.log("%cMade by Aiden Geiss\n\n", "font-size: 20px;")
  </script>


</html>
