<?php
if(isset($_GET['404'])) {
  die("<script>location.href='/?error=404'</script>");
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
      <script src="/js/analytics.js" defer></script>


    <link rel='icon' type="image/png" href='/img/red_clock.png'>
  </head>


  <body onload="rcf.emit('load')">
    <div id='load'></div>
    <div id='scheduleloaderror' class='errorbox hidden'>
      The schedule could not be loaded. Try again later.
    </div>
    <div id='dummy' class='hidden' hidden></div>
    <div id='schoolselector' class='content-container' style="display: none;"></div>
    <div id='countdown' class='content-container'></div>
    <div id='about' class='content-container'></div>
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


  rcf.loaded = false;
  rcf.on('load', () => {
    rcf.loaded = true;
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