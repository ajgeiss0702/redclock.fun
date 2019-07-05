var activePage = "schoolselector"

function loadContent(pageName) {
  httpGet('/pages/'+pageName+'.html').then((c) => {
    var elem = $('#'+pageName);
    $('#'+activePage).slideUp()
    $('#'+activePage).removeClass('fadein');
    $('#'+activePage).addClass('fadeOut');
    activePage = pageName;
    elem.slideDown();
    elem[0].classList = 'fadein'
    elem.html(c);
  })
}

async function pageInit() {
  if(typeof rcf.school == 'undefined') {
    loadContent('schoolselector');
  } else if(!(await schoolExists(rcf.school))) {
    loadContent('schoolselector');
  } else {
    loadContent('countdown');
  }
}
pageInit();