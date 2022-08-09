var scheduleselect = {
  clicked: (schedule) => {
    changeSchedule(schedule);
    loadContent('countdown');
  }
}

$('#schedule-list')[0].style.display = 'none';
rcf.on('load', async () => {
  if(_GET("reselect")) {
    $("#select-new")[0].classList.remove("hidden");
  }
  var e = $('#schedule-list')[0]
  if(typeof rcf.schoolList == 'undefined') {
    $(e).html('An error occured. See above error message for more details.');
    return;
  }
  if(typeof rcf.school == 'undefined' || rcf.school == null) {
    console.log("Going back to school selector because rcf.school is "+rcf.school)
    location.href="/reload.php?go=#schoolselector";
  }
  $("#school-name").text(rcf.schoolList[rcf.school].display);
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
