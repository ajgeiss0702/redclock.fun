rcf.on('pageload', festive);
settings.create("festive", true, "Festive", "Holiday Festiveness");
function festive() {
  if(typeof _GET("rmhs") != "string") {
    var month = new Date().getMonth();
    if((month == 10 || month == 11)) {
      if(settings.get("festive")) {
        $('#festive').html(`
          <img src="/img/lights.gif" class='festive-image'>
          `);
      } else {
        $('#festive').html(``);
      }
    }
  }
}
