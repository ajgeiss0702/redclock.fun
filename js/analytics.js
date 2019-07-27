function report() {
  $.post({
    url: 'https://api.redclock.fun/checkin/'+rcf.school+'/'+rcf.schedule,
    data: {
      id: localStorage.id
    },
    success: (d) => {
      var data = JSON.parse(d);
      localStorage.id = data.id;
      console.log(data);
    }
  })
}

rcf.on('load', () => {
  setInterval(report, 30e3);
  report();
})