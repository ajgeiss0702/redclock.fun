var settings = {};

var rawSettings = {};

settings.get = (name) => {
  if(typeof rawSettings[name] == 'undefined') {
    return undefined;
  }
  if(name == 'animatedWeatherIcon' && _GET('layout') != null) {
    return false;
  }
  return rawSettings[name].content;
}

settings.set = (name, content) => {
  if(typeof rawSettings[name] == 'undefined') {
    return false;
  }

  console.log("[Settings] "+name+": "+rawSettings[name].content+"  -->  "+content)
  rawSettings[name].content = content;
  rawSettings[name].type = typeof content;
  settings.save();
  return true;
}

settings.create = (name, content, display, desc) => {
  if(!settings.ready) {
    setTimeout(() => {
      settings.create(name, content, display, desc);
    }, 50)
    return;
  }
  if(typeof rawSettings[name] == 'undefined') {
    rawSettings[name] = {
      content: content,
      type: typeof content,
      display: display,
      desc: desc
    }
    settings.save();
  } else {
    rawSettings[name].display = display;
    rawSettings[name].desc = desc;
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

settings.setFromCheckbox = (setting, e) => {
  var elem = $(e);
  settings.set(setting, elem[0].checked);
  updateWeather();
  settings.save();
}

settings.update = () => {
  settings.load();
  var ah = "<h1>Settings</h1><small>The 🔋 icon means that setting will save battery if disabled.<br></small><br><table class='sett-table'>";
  for (var settingID in rawSettings) {
    if (rawSettings.hasOwnProperty(settingID)) {
      var setting = rawSettings[settingID];
      var changebox = "";

      if(typeof setting.display == 'undefined') continue;


      switch(setting.type) {
        case 'boolean':
          var checked = setting.content ? " checked" : "";
          changebox = `
          <label class="tgl tgl-gray">
            <input type="checkbox"`+checked+` onchange="settings.setFromCheckbox('`+settingID+`', this)">
            <span data-on="On" data-off="Off"></span>
          </label>
          `;
      }

      ah += `
      <tr data-toggle="tooltip" data-placement="top" title="`+setting.desc+`">
      <td class='sett-title'>`+setting.display+`</td>
      <td class='sett-change'>
        `+changebox+`
      </td>
      </tr>
      `;
    }
  }
  ah += `</table><br>
  <a class='btn btn-primary' onclick='openLayoutMenu()'>Themes and Layouts</a><br>
  <br>
  <a class='btn btn-secondary' href='#schoolselector'>Select a different school</a>
  `
  $('#settings-container').html(ah);

  $(() => {
    $('[data-toggle="tooltip"]').tooltip()
  })
}


settings.ready = false;
(function(){
  function init() {
    settings.load();
    settings.update();
    settings.ready = true;
  }
  rcf.on('pageload', init);
  rcf.on('load', init);
})()