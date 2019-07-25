var settings = {};

var rawSettings = {};

settings.get = (name) => {
  if(typeof rawSettings[name] == 'undefined') {
    return undefined;
  }
  return rawSettings[name].content;
}

settings.set = (name, content) => {
  if(typeof rawSettings[name] == 'undefined') {
    return false;
  }
  rawSettings[name].content = content;
  rawSettings[name].type = typeof content;
  settings.save();
  return true;
}

settings.create = (name, content, display, desc) => {
  if(typeof rawSettings[name] == 'undefined') {
    rawSettings[name] = {
      content: content,
      type: typeof content,
      display: display,
      desc: desc
    }
    settings.save();
  }
}

settings.save = () => {
  localStorage.settings = JSON.stringify(rawSettings);
}
settings.load = () => {
  if(typeof localStorage.settings != 'undefined') {
    rawSettings = JSON.parse(localStorage.settings);
  }
}

settings.update = () => {
  var ah = "<h1>Settings</h1>";
  for (var settingID in rawSettings) {
    if (rawSettings.hasOwnProperty(settingID)) {
      var setting = rawSettings[settingID];
      ah += `
      <table>
      <td class='sett-title'>`+setting.display+`</td><td class='sett-desc'>`+setting.desc+`</td>
      </table>
      `
    }
  }
  $('#settings-container').html(ah);
}

rcf.on('pageload', settings.update);
rcf.on('load', settings.update);