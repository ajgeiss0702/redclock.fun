var schoolselector = {
  clicked: (school) => {
    changeSchool(school);
    loadContent('scheduleselect');
  }
}

$('#school-list')[0].style.display = 'none';
rcf.on('load', () => {
  var e = $('#school-list')[0]
  if(typeof rcf.schoolList == 'undefined') {
    $(e).html('An error occured. See above error message for more details.');
    return;
  }
  console.log("[SCHOOLLIST] "+rcf.schoolList)
  var ah = "";
  var schools = Object.keys(rcf.schoolList);
  for (schoolCode in schools) {
    var school = rcf.schoolList[schools[schoolCode]];
    console.debug(schoolCode + school);
    if(schools[schoolCode] == 'example (this is the school name)') continue;
    var name = school.display;
    var icon = school.logo;
    ah += `<div class='schoolbox' style='background-image: url("`+icon+`");' onclick='schoolselector.clicked("`+schools[schoolCode]+`")'>
      <span></span>
      <div class='schooltext'>
        `+name+`
      </div>
    </div>`;
  }
  $(e).html(ah);
  e.classList.add('fadeIn');
  e.style.display = '';
  if(_GET('rmtv') == "undefined") {
    schoolselector.clicked("rmhs");
  }
})
