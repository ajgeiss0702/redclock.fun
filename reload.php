<?php

if(isset($_GET['go'])) {
  //die($_GET['go']);
  die("<script>location.href='/".$_GET['go']."';</script>");
} else {
  die("<script>location.href='https://redclock.fun/';</script>");
}
