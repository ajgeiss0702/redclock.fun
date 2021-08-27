<?php

if(isset($_GET['go'])) {
  //die($_GET['go']);
  //die("<script>location.href='/".$_GET['go']."';</script>");
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: ".$_SERVER["HTTP_REFERER"].$_GET['go']);
  die();
} else {
  header("HTTP/1.1 301 Permanantly moved");
  header("Location: ".$_SERVER["HTTP_REFERER"]);
  die();
}
