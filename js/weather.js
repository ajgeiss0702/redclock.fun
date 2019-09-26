$('html').ready(() => {
  reload_js('/js/skycons.js');
  setTimeout(() => {
    updateWeather();
  }, 500)
})

settings.create('enableWeather', true, 'Enable Weather', 'Disabling this will save battery (disable the animated weather icon, that\'s the thing that sucks the most battery)');
settings.create('animatedWeatherIcon', true, "Animated weather icon 🔋", "The animated weather icon looks cool, but it sucks the most power of everything on the page. Disabling it will help save battery")
settings.create('exactTemp', false, "Exact temperature", "If enabled, will round to two decimal places on the temperature. If disabled, will round to the nearest whole number.")


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
      if(rcf.theme == 'dark') {
        scc = 'white';
      }
      skycons = new Skycons({"color": scc});
      var d = JSON.parse(data);
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
                  `+/*d.mindesc+*/"<br>"+d.desc+`<br>
                  <table>
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
      setTimeout(() => {
        $('#weatherdiv').slideDown();
      }, 100);
      skycons.set($('#weather-icon')[0], d['icon']);
      if(typeof debug != 'undefined') {
        console.log(skycons);
      }
      skycons.play();
      setTimeout(() => {
        if(!settings.get('animatedWeatherIcon')) {
          skycons.pause();
        }
      }, 250);
    });
  } catch(e) {
    console.error(e);
    $('#weatherdiv').html('An error occured: <small>' + e + '</small>');
    setTimeout(updateWeather, 10000);
  }
}
