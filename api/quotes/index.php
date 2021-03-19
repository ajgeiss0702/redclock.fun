<?php

$quotesraw = file_get_contents('quotes.txt');
$quotes = explode("\n", $quotesraw);

if(isset($_GET['id'])) {
  die($quotes[number_format($_GET['id'])]);
}

shuffle($quotes);

if($quotes[1] == "") {
  die($quotes[0]);
} else {
  die($quotes[1]);
}


 ?>
Something went wrong -Redclock.fun right now
