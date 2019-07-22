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

settings.create = (name, content) => {
  if(typeof rawSettings[name] == 'undefined') {
    rawSettings[name] = {
      content: content,
      type: typeof content
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