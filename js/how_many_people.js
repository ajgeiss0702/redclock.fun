var analytics = {};
analytics.lastRl = -1;
analytics.report = () => {
  $.post({
    url: 'https://api.redclock.fun/checkin/'+rcf.school+'/'+rcf.schedule,
    data: {
      id: localStorage.id,
      tab: localStorage.tabId
    },
    success: (data) => {
      localStorage.id = data.id;
      console.debug(data);
      if(analytics.lastRl >= 0) {
        if(analytics.lastRl < data.rel) {
          console.log("Reload number is higher than before! Reloading..")
          location.href="/reload.php?go="+encodeURIComponent(location.href.split("redclock.fun/")[1]);
        }
      }
      analytics.lastRl = data.rel;
    }
  })
}

rcf.on('load', () => {
  setInterval(analytics.report, 30e3);
  setTimeout(analytics.report, 1e3);
})
