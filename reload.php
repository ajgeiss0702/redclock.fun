<?php

if(isset($_GET['go'])) {
  //die($_GET['go']);
  //die("<script>location.href='/".$_GET['go']."';</script>");
  header("HTTP/1.1 301 Permanantly moved");
  if(strpos($_SERVER['HTTP_HOST'], "localhost") !== false) {
    header("Location: http://localhost.redclock.fun/".$_GET['go']);
  } else if(strpos($_SERVER['HTTP_HOST'], "folly.local") !== false) {
    header("Location: http://folly.local/".$_GET['go']);
  } else {
    header("Location: https://redclock.fun/".$_GET['go']);
  }

  die("Going to: https://redclock.fun/".$_GET['go']);
} else {
  header("HTTP/1.1 301 Permanantly moved");
  if(strpos($_SERVER['HTTP_HOST'], "localhost") !== false) {
      header("Location: http://localhost.redclock.fun/");
  } else {
      header("Location: https://redclock.fun/");
  }
  die("Going to: https://redclock.fun/");
}
