var activePage = "dummy";

function loadContent(pageName) {
  var oldPage = activePage;
  if(typeof calibratingInterval != 'undefined') {
    clearInterval(calibratingInterval);
    calibratingInterval = undefined;
  }
  if(typeof countdownMainInterval != 'undefined') {
    clearInterval(countdownMainInterval);
    countdownMainInterval = undefined;
  }
  $('#load').slideDown('fast');
  $('#'+activePage+'-ct').slideUp(400, () => {
    $('#'+oldPage+'-ct').html('');
  })
  $('#'+activePage+'-ct').removeClass('fadeIn');
  $('#'+activePage+'-ct').addClass('fadeOut');
  httpGet('/pages/'+pageName+'.html').then((c) => {
    var elem = $('#'+pageName+'-ct');
    elem.html(c);
    activePage = pageName;
    elem.slideDown();
    elem[0].classList = 'fadeIn';
    if(pageName == 'countdown') {
      insertNews();
      updateWeather();
    }
    location.hash = "#"+pageName;
    $('#load').slideUp('fast');
    rcf.emit('pageload');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.title = caps(pageName) + " - Red Clock";
  })
}

$(window).on('hashchange', function() {
  var newhash = location.hash.split('#').splice(1).join('#');
  if(location.hash != "" && newhash != activePage) {
    loadContent(newhash);
  }
});

async function pageInit() {
  if(location.hash != "") {
    loadContent(location.hash.split('#').splice(1).join('#'));
    return;
  }
  if(typeof rcf.school == 'undefined') {
    loadContent('schoolselector');
  } else if(!(await schoolExists(rcf.school))) {
    loadContent('schoolselector');
  } else {
    loadContent('countdown');
  }
}
rcf.on('load', () => {
  pageInit();
})
