<?php

if(isset($_GET['go'])) {
  //die($_GET['go']);
  //die("<script>location.href='/".$_GET['go']."';</script>");
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: https://redclock.fun/".$_GET['go']);
  die("Going to: https://redclock.fun/".$_GET['go']);
} else {
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: https://redclock.fun/");
  die("Going to: https://redclock.fun/");
}
