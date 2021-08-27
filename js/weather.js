$('html').ready(() => {
  reload_js('/js/skycons.js');
  setTimeout(() => {
    updateWeather();
  }, 500)
})

settings.create('enableWeather', true, 'Enable Weather', 'Disabling this will save battery (disable the animated weather icon, that\'s the thing that sucks the most battery)');
settings.create('animatedWeatherIcon', false, "Animated weather icon 🔋", "The animated weather icon looks cool, but it sucks the most power of everything on the page. Disabling it will help save battery")
settings.create('exactTemp', false, "Exact temperature", "If enabled, will round to two decimal places on the temperature. If disabled, will round to the nearest whole number.")


var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var icons = {
  "01d": "CLEAR_DAY",
  "01n": "CLEAR_NIGHT",
  "02d": "PARTLY_CLOUDY_DAY",
  "02n": "PARTLY_CLOUDY_NIGHT",
  "03d": "CLOUDY",
  "03n": "CLOUDY",
  "04d": "PARTLY_CLOUDY_DAY",
  "04n": "PARTLY_CLOUDY_NIGHT",
  "09d": "RAIN",
  "09n": "RAIN",
  "10d": "RAIN",
  "10n": "RAIN",
  "11d": "RAIN",
  "11n": "RAIN",
  "13d": "SNOW",
  "13n": "SNOW",
  "50d": "FOG",
  "50n": "FOG"
}

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
      <a onclick="$('#sidebar-tab-settings').tab('show')" style="cursor: pointer;">
        <img src='`+disWeaIcon+`' style='width: 5rem;display:block;margin-left:auto;margin-right:auto;'>
        <span style='display:block;font-size: 0.15em;padding-top:0;margin-top:0;'>Weather has been disabled in settings</span>
      </a>
      `;
      if($('#weatherdiv').html().indexOf("<!--disabledWeather-->") != 0) {
        $('#weatherdiv')[0].style.height = "0em";
      }
    console.debug("[weather.js] Skipping weather because its disabled");
    setTimeout(() => {
      $('#weatherdiv').html(disabledHtml);
      setTimeout(() => {
        $('#weatherdiv')[0].style.height = "7rem";
      }, 25)
    }, 725)
    return;
  }
  if(rcf.school != "rmhs") {
    $('#weatherdiv').html("<small style='font-size: 5vh;'>Weather display for your school coming soon<sup>tm</sup></small>");
    $('#weather')[0].style.display = "none";
    $('.countdown-container')[0].style["min-height"] = "99vh";
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
    $('#weatherdiv')[0].style.height = "0em";
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

      var uv = d.uvi;
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
      if(d.todayrain > 2) {
        rainAdd = Math.round(d.precipProbability * 100) + `% chance of rain right now`
      }

      var temperature = d.temp;
      if(!settings.get('exactTemp')) {
        temperature = Math.round(temperature);
      }

      setTimeout(() => {
        var desc = d.weather[0].description;
        var time = new Date(d.dt*1000);
        $('#weatherdiv').html(`<!--weather!-->
          <div align='center' style='font-size: 1rem;'>
            <table>
              <tr>
                <td><canvas id='weather-icon' height='100' width='100'></canvas></td>
                <td style='padding-left:0.25em;'>
                  <h1 style='font-size: 2.5em;' title="`+time.toLocaleDateString()+` `+time.toLocaleTimeString()+`">`+temperature+`&deg;</h1>
                  <p style='padding-left:0.25em; margin-bottom:0;padding-bottom:0;max-width:35vw;'>
                    `+/*d.mindesc+*/desc.charAt(0).toUpperCase() + desc.slice(1)+`.<br><br>
                    <div style='text-align: left;'>
                      <span id='we-wf-toggle' class="we-wf-toggle-btn" onclick='toggleWeeklyWeather()'>Today</span>
                    </div>
                    <table id='we-info-table'>
                      <tr class='weather-tr'>
                        <td>🌧️</td>
                        <td>`+d.todayrain+`% chance of rain today<br>`+rainAdd+`</td>
                      </tr>
                      <tr class='weather-tr'>
                        <td>💧</td>
                        <td>`+d.humidity+`% humidity<br></td>
                      </tr>
                      <tr class='weather-tr'>
                        <td>☀️</td>
                        <td>UV index: <span class='badge badge-pill badge-`+uvClass+`'>`+d.uvi+` (`+uvState+`)</span></td>
                      </tr>
                    </table>
                  </p>
                </td>

              </tr>
            </table>
          </div>
        `);
        console.debug("[weather] icon should be: "+icons[d.weather[0].icon]+" ("+d.weather[0].icon+")");
        skycons.set($('#weather-icon')[0], icons[d.weather[0].icon]);
        if(typeof debug != 'undefined') {
          console.log(skycons);
        }
        if(settings.get('animatedWeatherIcon')) {
          skycons.play();
        }
        toggleWeeklyWeather(true);
      }, 350)
      setTimeout(() => {
        $('#weatherdiv')[0].style.height = "15rem";
      }, 750);

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
      var dayname = (i == 1) ? "Today" : dayNames[new Date(t.dt * 1000).getDay()]
      if(i == 2) {
        dayname = "Tomorrow";
      }
      ahDays += "<td class='we-wf-day'>"+dayname+"</td>"
      if(!settings.get("exactTemp")) {
        if(t.temp.max >= 67.5 && t.temp.max < 70.5) {
          t.temp.max = 69;
        }
      }

      var htemp = settings.get("exactTemp") ? t.temp.max : Math.round(t.temp.max);
      var ltemp = settings.get("exactTemp") ? t.temp.min : Math.round(t.temp.min);
      ahDeg += "<td><span class='we-wf-htemp'><span id='we-wf-htemp-"+i+"'>"+htemp+"</span>&deg;</span><br><span class='we-wf-ltemp'>"+ltemp+"&deg;</span></td>"
      ahRain += "<td class='we-wf-precip'>🌧️"+t.pop+"%</td>";
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
