<?php
require('../include/pages.php');
$page = new Page('Weather', '../');
$page->header();
 ?>


<style>
.smooth {
  transition: .4s !important;
}
.icon {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
}
</style>

<div align='center' id='weatherdiv'></div>
<div align='center'>
  <a class='smooth btn btn-success' onclick='updateWeather()' id='wea-btn'>Update Weather</a>
</div>
<div id='weatherhere' align='center'></div>

<script src='/weather/widget.js' deter></script>

<?php
$page->footer();