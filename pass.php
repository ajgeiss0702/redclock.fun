<script src="/js/jquery.min.js"></script>
<link rel='stylesheet' id='theme-changer' href='/css/themes/<?php
if(isset($_COOKIE['theme'])) {
  echo($_COOKIE['theme']);
} else {
  echo('light');
}
?>.css?r=1'>
<div id="text" style="text-align: center; margin-top: 25vh;">..</div>
<script>

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

(() => {
  var school = localStorage.getItem("school");
  var schedule = localStorage.getItem("schedule");

  if(_GET("id") == null) {
    $("#text").text("This page should be opened from the desktop app!")
    console.log("no id");
    return;
  }

  $("#text").text("Sending your selected school and schedule to the desktop app..")

  $.post({
    url: "https://api.redclock.fun/pass/"+_GET("id"),
    data: {
      school: localStorage.getItem("school"),
      schedule: localStorage.getItem("schedule")
    },
    success: () => {
      $("#text").html("Your selected school and schedule has been sent.<br>You can close this window now.")
    }
  })

})();

</script>
