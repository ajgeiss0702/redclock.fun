<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Calendar</title>
    <link rel='stylesheet' id='theme-changer' href='/css/themes/<?php
    if(isset($_COOKIE['theme'])) {
    echo($_COOKIE['theme']);
    } else {
    echo('light');
    }
    ?>.css?r=1'>
    <script>
      let rcf = {};
      rcf.on = () => {};
    </script>
    <script src="https://redclock.fun/js/base.js"></script>
    <style>
      .day {
        width: 5em;
        height: 5em;
        padding: 0.5em;
        border: 1px solid black;
        border-collapse: collapse;
        vertical-align: top;
      }
      .number {
        height: 3em;
        line-height: 3em;
        text-align: center;
      }
      .today {
          background-color: <?php
              if(isset($_COOKIE['theme'])) {
                if($_COOKIE['theme'] == "black" || $_COOKIE['theme'] == "dark") {
                    echo("rgb(49, 53, 55)");
                } else {
                    echo("lightgray");
                }
              } else {
                echo('lightgray');
              }
              ?>;
      }
      .weekdays > td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 0.5em;
        text-align: center;
      }
      .calendar {
        margin-left: auto;
        margin-right: auto;
        padding: 0;
        border: 1px solid black;
        border-collapse: collapse;
      }
    </style>
  </head>
  <body>
    <div id="month" style="text-align: center; font-size: 2em;"></div>
    <table class="calendar">
      <tr class="weekdays">
        <td>Sunday</td>
        <td>Monday</td>
        <td>Tuesday</td>
        <td>Wednesday</td>
        <td>Thursday</td>
        <td>Friday</td>
        <td>Saturday</td>
      </tr>
      <tr id="w1">
        <td class="day" id="w1d0"></td>
        <td class="day" id="w1d1"></td>
        <td class="day" id="w1d2"></td>
        <td class="day" id="w1d3"></td>
        <td class="day" id="w1d4"></td>
        <td class="day" id="w1d5"></td>
        <td class="day" id="w1d6"></td>
      </tr>
      <tr id="w2">
        <td class="day" id="w2d0"></td>
        <td class="day" id="w2d1"></td>
        <td class="day" id="w2d2"></td>
        <td class="day" id="w2d3"></td>
        <td class="day" id="w2d4"></td>
        <td class="day" id="w2d5"></td>
        <td class="day" id="w2d6"></td>
      </tr>
      <tr id="w3">
        <td class="day" id="w3d0"></td>
        <td class="day" id="w3d1"></td>
        <td class="day" id="w3d2"></td>
        <td class="day" id="w3d3"></td>
        <td class="day" id="w3d4"></td>
        <td class="day" id="w3d5"></td>
        <td class="day" id="w3d6"></td>
      </tr>
      <tr id="w4">
        <td class="day" id="w4d0"></td>
        <td class="day" id="w4d1"></td>
        <td class="day" id="w4d2"></td>
        <td class="day" id="w4d3"></td>
        <td class="day" id="w4d4"></td>
        <td class="day" id="w4d5"></td>
        <td class="day" id="w4d6"></td>
      </tr>
      <tr id="w5">
        <td class="day" id="w5d0"></td>
        <td class="day" id="w5d1"></td>
        <td class="day" id="w5d2"></td>
        <td class="day" id="w5d3"></td>
        <td class="day" id="w5d4"></td>
        <td class="day" id="w5d5"></td>
        <td class="day" id="w5d6"></td>
      </tr>
    </table>
    <script type="text/javascript">
      function getDaysInMonth(date) {
        date = new Date(date);
        var d = new Date(date);
        d.setMonth(date.getMonth()+1)
        d.setDate(0)
        return d.getDate();
      }
      let monthNames = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]

      let now = new Date();
      let monthName = monthNames[now.getMonth()];
      document.getElementById("month").innerText = monthName;

      let week = 1;
      let today;
      (async () => {
        for (let i = 1; i <= getDaysInMonth(now); i++) {
          let date = new Date(now);
          date.setDate(i);

          let dayCell = document.getElementById("w" + week + "d" + date.getDay());
          dayCell.innerHTML = i+".<div class='number'></div>";

          let numberElement = dayCell.getElementsByClassName("number").item(0);
          if(date.getDate() <= now.getDate()) {
            let dateFormatted = date.toLocaleDateString().replace(/\//g, ".");
            (async () => {
              numberElement.innerText = commas(await httpGet("https://api.redclock.fun/checkin/date/" + dateFormatted));
            })().then();

          }
          if(date.getDate() === now.getDate()) {
            today = numberElement;
            dayCell.classList.add("today");
          }

          if(date.getDay() === 6) week++;
        }

        if(typeof today !== 'undefined') {
          setInterval(async () => {
            today.innerText = commas(await httpGet("https://api.redclock.fun/checkin/today"));
          }, 10e3);
        }
      })();
    </script>
  </body>
</html>
