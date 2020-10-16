var analytics = {};
analytics.lastRl = -1;
analytics.report = () => {
  var d = false;
  if(typeof rcf.desktop != "undefined") {
    if(rcf.desktop) {
      d = true;
    }
  }
  $.post({
    url: 'https://api.redclock.fun/checkin/'+rcf.school+'/'+rcf.schedule,
    data: {
      id: localStorage.id,
      tab: localStorage.tabId,
      desktop: d+""
    },
    success: (data) => {
      localStorage.id = data.id;
      console.debug(data);
      if(analytics.lastRl >= 0) {
        if(analytics.lastRl < data.rel) {
          console.log("Reload number is higher than before! Reloading..")
          if(!rcf.desktop) {
            location.href="/reload.php?go="+encodeURIComponent(location.href.split("redclock.fun/")[1]);
          } else {
            location.href="";
          }
        }
      }
      analytics.lastRl = data.rel;


      if(typeof data.message != "undefined") {
        analytics.recieveMessage(data.message)
      }
    }
  })
}

analytics.recieveMessage = (message) => {
  $('body').append(`
    <div class="alert alert-info alert-dismissible fade show" role="alert" style='position: absolute;left:1em;bottom:1em;'>
      <h3>Message from website admin</h3>
      <hr>
      <span id="adminmessagebox"></span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    `);
    $('#adminmessagebox').text(message);
}

rcf.on('load', () => {
  setInterval(analytics.report, 30e3);
  setTimeout(analytics.report, 1e3);
})
