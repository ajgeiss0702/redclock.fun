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
  var ah = "";
  for (var setting in rawSettings) {
    if (rawSettings.hasOwnProperty(setting)) {
      
    }
  }
}