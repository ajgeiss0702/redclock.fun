<?php
header('Content-Type: application/json');
error_reporting(0);
$lastcheck = 0;
if(file_exists('lastcheck.temp')) {
  $lastcheck = (int)file_get_contents('lastcheck.temp');
}
$current = (int)time();


function cached() {
  $last = "{}";
  if(file_exists('lastweather.temp')) {
    $last = file_get_contents('lastweather.temp');
  }
  $last = json_decode($last, true);
  $last['currently']['cached'] = true;
  if(isset($_GET['debug'])) {
    if(isset($_GET['full'])) {
      print_r($last);
    } else {
      print_r($last['currently']);
    }
    die();
  }
  die(json_encode($last['currently']));
}

if($lastcheck <= $current-120 || isset($_GET['last'])) { // orig 3600 which means 1 update per hour
  cached();
  die();
}



$lastacc = 0;
if(file_exists('lastacc.temp')) {
  $lastacc = (int)file_get_contents('lastacc.temp');
}
$accs = array(
  "bf26c7abb25893e59cc5a0afeb62b36c"
);

if($lastacc+1 >= count($accs)) {
  $lastacc = 0;
} else {
  $lastacc = $lastacc + 1;
}
file_put_contents('lastacc.temp', $lastacc);
$json = file_get_contents('https://api.openweathermap.org/data/2.5/onecall?appid='.$accs[$lastacc].'&lat=33.435016&lon=-111.673358&units=imperial');
//$json = file_get_contents('')
$weather = json_decode($json, true);
if($weather == false) {
  cached();
}
$result = $weather;
$result['currently'] = $result["current"];
$result['currently']['au'] = $lastacc;
$result['currently']['mindesc'] = $weather['minutely']['summary'];
$result['currently']['desc'] = $weather['hourly']['summary'];
$result['currently']['timezone'] = $weather['timezone'];
$result['currently']['todayrain'] = $weather['daily'][0]['pop'];
$result['currently']['week-forecast'] = $weather['daily'];
file_put_contents('lastweather.temp', json_encode($result));
file_put_contents('lastcheck.temp', $current);
$result['currently']['cached'] = false;
if(isset($_GET['debug'])) {
  if(isset($_GET['full'])) {
    print_r($result);
  } else {
    print_r($result['currently']);
  }
  die();
}
die(json_encode($result['currently']));


?>
<!DOCTYPE html>
An error occured
