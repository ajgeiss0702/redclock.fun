var activePage = "dummy";

var cascade = 0;

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
    location.hash = "#"+pageName;
    $('#load').slideUp('fast');
    rcf.emit('pageload');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.title = caps(pageName) + " - Red Clock";
    if(pageName == 'countdown') {
      setTimeout(() => {
        rcf.on('load', () => {
          setTimeout(() => {
            insertNews();
            updateWeather();
          }, 500)
        })
      }, 500)
    }
  }).catch(() => {
    if(pageName == "error") {
      var c = `An error occurred. Check your internet.`;

      var elem = $('#'+pageName+'-ct');
      elem.html(c);
      activePage = pageName;
      elem.slideDown();
      elem[0].classList = 'fadeIn';
      location.hash = "#"+pageName;
      $('#load').slideUp('fast');
      rcf.emit('pageload');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      document.title = caps(pageName) + " - Red Clock";
      return;
    }
    if(cascade > new Date().getTime()-500) {
      return;
    }
    cascade = new Date().getTime();
    console.log("Caught error");
    loadContent("error");
  })
}

$(window).on('hashchange', function() {
  var newhash = location.hash.split('#').splice(1).join('#');
  if(location.hash != "" && newhash != activePage) {
    loadContent(newhash);
  }
});

var pageInitRetryCount = 0;
async function pageInit() {
  if((typeof settings != 'object' || typeof rcf != 'object') && pageInitRetryCount < 10) {
    console.debug("Delaying init: "+typeof settings+" "+typeof rcf);
    setTimeout(() => {
      pageInitRetryCount++;
      pageInit();
    }, 100);
    return;
  }
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
