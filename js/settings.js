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
      var changebox = "";

      switch(setting.type) {
        case 'boolean':
          var checked = setting.value ? " checked" : "";
          changebox = `
          <label class="tgl">
            <input type="checkbox"`+checked+`>
            <span data-on="On" data-off="Off"></span>
          </label>
          `;
      }

      ah += `
      <table data-toggle="tooltip" data-placement="top" title="`+setting.desc+`" class='sett-table'>
      <td class='sett-title'>`+setting.display+`</td>
      <td class='sett-change'>
        `+changebox+`
      </td>
      </table>
      `;
    }
  }
  $('#settings-container').html(ah);
  $(() => {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

rcf.on('pageload', settings.update);
rcf.on('load', settings.update);