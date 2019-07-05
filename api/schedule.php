<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Orgin: *');
if(!file_exists("../../schools.json")) {
  $raw = file_get_contents("https://astrophoenix.com/~aiden/api/rmf/schools.json");
  $file = fopen("../../schools.json", "w");
  fwrite($file, $raw);
  fclose($file);
}
$raw = file_get_contents('../../schools.json');
$schools = JSON_decode($raw, true);
if(isset($_GET['school'])) {
  if($_GET['school'] == "list") {
    foreach ($schools as $key => $value) {
      $schools[$key] = array(
        'display' => $value['display'],
        'logo' => $value['logo']
      );
    }
    die(JSON_encode($schools));
  }
  if(isset($schools[$_GET['school']])) {
    die('{"'.$_GET['school'].'":'.JSON_encode($schools[$_GET['school']]).'}');
  } else {
    header('HTTP/1.1 400 Invalid Key');
    die('{"error": "Invalid key."}');
  }
} else if(isset($_GET['exists'])) {
  $keys = array();
  foreach ($schools as $key => $value) {
    array_push($keys, $key);
    if($key == $_GET['exists']) {
      die('{"exists": true}');
    }
  }
  die('{"exists": false, "debug":"'.str_replace("\n", " ", print_r($keys, true)).'"}');
} else {
  header('HTTP/1.1 400 Invalid Key');
  die('{"error": "Invalid key."}');
}