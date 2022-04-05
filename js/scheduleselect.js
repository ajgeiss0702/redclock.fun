var scheduleselect = {
  clicked: (schedule) => {
    changeSchedule(schedule);
    loadContent('countdown');
  }
}

$('#schedule-list')[0].style.display = 'none';
rcf.on('load', async () => {
  var e = $('#schedule-list')[0]
  if(typeof rcf.schoolList == 'undefined') {
    $(e).html('An error occured. See above error message for more details.');
    return;
  }
  var ah = "";
  var schedules = Object.keys(rcf.schoolList[rcf.school].schedules);
  if(schedules.length == 0) {
    loadContent('countdown');
    return;
  }
  console.debug(schedules);
  for (scheduleCode in schedules) {
    var schedule = rcf.schoolList[rcf.school].schedules[schedules[scheduleCode]];
    console.debug(schedule)
    ah += `<div class='schoolbox' onclick='scheduleselect.clicked("`+schedules[scheduleCode]+`")'>
      <span></span>
      <div class='scheduletext'>
        `+schedule+`
      </div>
    </div>`;
  }
  $(e).html(ah);
  e.classList.add('fadeIn');
  e.style.display = '';
  if(_GET('rmtv') == "undefined") {
    setTimeout(() => {
      scheduleselect.clicked("rmtv");
    }, 100);
  }
})
