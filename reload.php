<?php

if(isset($_GET['go'])) {
  //die($_GET['go']);
  die("<script>location.href='/".$_GET['go']."';</script>");
} else {
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: https://redclock.fun");
  die();
}
