$('html').ready(() => {
  reload_js('/js/skycons.js');
  setTimeout(() => {
    updateWeather();
  }, 500)
})

settings.create('enableWeather', true, 'Enable Weather', 'Disabling this will save battery (disable the animated weather icon, that\'s the thing that sucks the most battery)');
settings.create('animatedWeatherIcon', true, "Animated weather icon 🔋", "The animated weather icon looks cool, but it sucks the most power of everything on the page. Disabling it will help save battery")
settings.create('exactTemp', false, "Exact temperature", "If enabled, will round to two decimal places on the temperature. If disabled, will round to the nearest whole number.")


var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var lastData;

var skycons;
function updateWeather(last = false) {
  if(typeof $('#weatherdiv').html() != 'string') {
    console.debug("[weather.js] Skipping weather because the element is not ready");
    return;
  }
  if(!settings.get('enableWeather')) {
    var disWeaIcon = rcf.theme == "light" ? '/img/weather-disabled.svg' : '/img/weather-disabled-white.svg';
    var disabledHtml = `<!--disabledWeather-->
      <a onclick="$('#sidebar-tab-settings').tab('show')" style='cursor: pointer;'>
        <img src='`+disWeaIcon+`' style='width: 25%'><br>
        <span style='font-size: 15%;'>Weather has been disabled in settings</span>
      </a>
      `;
      if($('#weatherdiv').html().indexOf("<!--disabledWeather-->") != 0) {
        $('#weatherdiv').slideUp(100);
      }
    console.debug("[weather.js] Skipping weather because its disabled");
    setTimeout(() => {
      $('#weatherdiv').html(disabledHtml);
      setTimeout(() => {
        $('#weatherdiv').slideDown();
      }, 50)
    }, 150)
    return;
  }
  if(rcf.school != "rmhs") {
    $('#weatherdiv').html("<small style='font-size: 5vh;'>Weather display for your school coming soon<sup>tm</sup></small>");
    return;
  }
  if($('#weatherdiv').length <= 0) {
    console.debug('[weather.js] Skipping weather because the div cannot be found.');
    return;
  }

  if(typeof Skycons != 'function') {
    console.debug("[weather.js] Skipping weather because skycons arent ready yet.");
    return;
  }

  if($('#weatherdiv').html().indexOf(`<!--weather!-->`) != 0) {
    $('#weatherdiv').slideUp(100)
  }

  try {
    var au = ''
    if(last) au = '?last'
    httpGet('/api/weather/get.php'+au, data => {

      var scc = 'black'
      if(rcf.theme == 'dark' || rcf.theme == 'black') {
        scc = 'white';
      }
      skycons = new Skycons({"color": scc});
      var d = JSON.parse(data);

      lastData = d;
      if(d.error) {
        $('#weatherdiv').html(`
          <h1 class='text text-danger'>An error occured</h1>
          `+d.message+`
          `);
        return;
      }
      var dk = Object.keys(d);
      var i = 0;
      var ah = '';

      var uv = d.uvIndex;
      var uvState = "";
      var uvClass = ""
      if(uv >= 11) {
        uvClass = "danger";
        uvState = "Extreme";
      } else if(uv > 8) {
        uvClass = "danger";
        uvState = "Very High"
      } else if(uv > 6) {
        uvClass = "warning";
        uvState = "High";
      } else if(uv > 3) {
        uvClass = "warning";
        uvState = "Moderate";
      } else {
        uvClass = "success";
        uvState = "Low";
      }

      var rainAdd = ""
      if(d.todayrain > 0) {
        rainAdd = Math.round(d.precipProbability * 100) + `% chance of rain right now`
      }
      rainAdd = "";

      var temperature = d.temperature;
      if(!settings.get('exactTemp')) {
        temperature = Math.round(temperature);
      }

      $('#weatherdiv').html(`<!--weather!-->
        <div align='center'>
          <table>
            <tr>
              <td><canvas id='weather-icon' height='100' width='100'></canvas></td>
              <td style='padding-left:0.25em;'>
                <h1 style='font-size: 2.5em;'>`+temperature+`&deg;</h1>
                <p style='padding-left:0.25em; margin-bottom:0;padding-bottom:0;max-width:35vw;'>
                  `+/*d.mindesc+*/d.desc+`<br><br>
                  <div style='text-align: left;'>
                    <a id='we-wf-toggle' class="we-wf-toggle-btn" onclick='toggleWeeklyWeather()'>Today</a>
                  </div>
                  <table id='we-info-table'>
                    <tr class='weather-tr'>
                      <td>🌧️</td>
                      <td>`+Math.round(Number(d.todayrain) * 100)+`% chance of rain today<br>`+rainAdd+`</td>
                    </tr>
                    <tr class='weather-tr'>
                      <td>💧</td>
                      <td>`+Math.round(d.humidity * 100)+`% humidity<br></td>
                    </tr>
                    <tr class='weather-tr'>
                      <td>☀️</td>
                      <td>UV index: <span class='badge badge-pill badge-`+uvClass+`'>`+d.uvIndex+` (`+uvState+`)</span></td>
                    </tr>
                  </table>
                </p>
              </td>

            </tr>
          </table>
        </div>
      `);
      toggleWeeklyWeather(true);
      setTimeout(() => {
        $('#weatherdiv').slideDown();
      }, 100);
      skycons.set($('#weather-icon')[0], d['icon']);
      if(typeof debug != 'undefined') {
        console.log(skycons);
      }
      if(settings.get('animatedWeatherIcon')) {
        skycons.play();
      }
    });
  } catch(e) {
    console.error(e);
    $('#weatherdiv').html('An error occured: <small>' + e + '</small>');
    setTimeout(updateWeather, 10000);
  }
}

var weeklyToggled;
if(typeof localStorage.weeklyWeather != 'string') {
  weeklyToggled = false;
} else {
  weeklyToggled = localStorage.weeklyWeather == "true";
}
function toggleWeeklyWeather(update = false) {
  if(!weeklyToggled && update) return;
  if((weeklyToggled && !update)) {
    if(!update) {
      weeklyToggled = false;
      localStorage.weeklyWeather = weeklyToggled+"";
      updateWeather();
    }
    $('#we-wf-toggle').text("Today");
    return;
  }
  $('#we-wf-toggle').text("This Week");
  var ahDays = "";
  var ahDeg = "";
  var ahRain = "";
  var i = 0;
  for (var day in lastData["week-forecast"]) {
    if (lastData["week-forecast"].hasOwnProperty(day)) {
      i++;
      if(i > 7) break;
      var t = lastData["week-forecast"][day]
      ahDays += "<td class='we-wf-day'>"+dayNames[new Date(t.time * 1000).getDay()]+"</td>"

      var htemp = settings.get("exactTemp") ? t.temperatureHigh : Math.round(t.temperatureHigh);
      var ltemp = settings.get("exactTemp") ? t.temperatureLow : Math.round(t.temperatureLow);
      ahDeg += "<td><span class='we-wf-htemp'>"+htemp+"</span>&deg;<br><span class='we-wf-ltemp'>"+ltemp+"&deg;</span></td>"
      ahRain += "<td class='we-wf-precip'>🌧️"+Math.round(t.precipProbability*10000)/100+"%</td>";
    }
  }
  if(!update) {
    weeklyToggled = true;
    localStorage.weeklyWeather = weeklyToggled+"";
  }
  $('#we-info-table').html(`
    <tr>
      `+ahDays+`
    </tr>
    <tr>
      `+ahDeg+`
    </tr>
    <tr>
      `+ahRain+`
    </tr>
    `);
}

