$('html').ready(() => {
  reload_js('/js/skycons.js');
  setTimeout(() => {
    updateWeather();
  }, 500)
})

settings.create('enableWeather', true, 'Enable Weather', 'If the weather is disabled, battery will be saved.');


var skycons;
function updateWeather(last = false) {
  if(!settings.get('enableWeather')) {
    console.debug("[weather.js] Skipping weather because its disabled");
    return;
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
      //$('#wea-btn')[0].classList = 'smooth btn btn-success';
      //$('#wea-btn').text('Update Weather');
      var d = JSON.parse(data);
      console.debug("[widget.js] AU: " + d.au);
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
 
      $('#weatherdiv').html(`
        <div align='center'>
          <table>
            <tr>
              <td><canvas id='weather-icon' height='100' width='100'></canvas></td>
              <td style='padding-left:0.25em;'>
                <h1 style='font-size: 2.5em;'>`+d.temperature+`&deg;</h1>
                <p style='padding-left:0.25em; margin-bottom:0;padding-bottom:0;max-width:35vw;'>
                  `+d.mindesc+"<br>"+d.desc+`<br>
                  <table>
                    <tr>
                      <td>🌧️</td>
                      <td>`+Math.round(Number(d.todayrain) * 100)+`% chance of rain today<br>`+rainAdd+`</td>
                    </tr>
                    <tr>
                      <td>💧</td>
                      <td>`+Math.round(d.humidity * 100)+`% humidity<br></td>
                    </tr>
                    <tr>
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
      skycons.set($('#weather-icon')[0], d['icon']);
      skycons.play()
      //$('#weatherhere').html(ah);
    });
  } catch(e) {
    console.error(e);
    $('#weatherdiv').html('An error occured: <small>' + e + '</small>');
    setTimeout(updateWeather, 10000);
  }
}