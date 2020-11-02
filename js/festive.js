rcf.on('pageload', festive);
function festive(day = new Date().getDate()) {
  //console.log("day: "+day);
  if(typeof _GET("rmtv") != "string") {
    var month = new Date().getMonth();
    if((month == 10 || month == 11)) {
      settings.create("festive", true, "Festive", "Holiday Festiveness");
      if(settings.get("festive")) {
        if(day == 21) {
          $('#festive').html(`
            <img src="/img/purple-ribbon.png" class='festive-image festive-purpleribbon'>
            `);
        } else {
          $('#festive').html(`
            <img src="/img/lights.gif" class='festive-image'>
            `);
        }
      } else {
        $('#festive').html(``);
      }
    }
  }
}

setTimeout(festive, 2e3);
setInterval(festive, 30*60e3);
