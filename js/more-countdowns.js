function updateMoreCountdowns() {
  var ah = "";
  // mm/dd = mm,dd or add time to the end 24hr,min
  var dates = [
    [new Date().getMonth(), new Date().getDate(), 15, 15]
  ];
  if(typeof getOffset != 'function') return;
  if(typeof cd != 'object') return;
  if(typeof cd.offset != 'number') getOffset();

  // TODO: Get breaks from json file

  var dd = [];
  for (date of dates) {
    dd.push()
  }

}
