<?php
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

if($lastcheck > $current-60 || isset($_GET['last'])) { // orig 3600 which means 1 update per hour
  cached();
  die();
}



$lastacc = 0;
if(file_exists('lastacc.temp')) {
  $lastacc = (int)file_get_contents('lastacc.temp');
}
$accs = array(
  "0cb4b50f1395c55501ed3223f3de0c2e",
  "76c853621078503b5d33706f5dbb281e",
  "2f7f991e5f152f246a0b44fa90483f98"
);

if($lastacc+1 >= count($accs)) {
  $lastacc = 0;
} else {
  $lastacc = $lastacc + 1;
}
file_put_contents('lastacc.temp', $lastacc);
$json = file_get_contents('https://api.darksky.net/forecast/'.$accs[$lastacc].'/33.435016,-111.673358');
//$json = file_get_contents('')
$weather = json_decode($json, true);
if($weather == false) {
  cached();
}
$result = $weather;
$result['currently']['au'] = $lastacc;
$result['currently']['mindesc'] = $weather['minutely']['summary'];
$result['currently']['desc'] = $weather['hourly']['summary'];
$result['currently']['timezone'] = $weather['timezone'];
$result['currently']['todayrain'] = $weather['daily']['data'][0]['precipProbability'];
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
