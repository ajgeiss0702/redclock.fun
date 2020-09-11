<?php

$quotesraw = file_get_contents('quotes.txt');
$quotes = explode("\n", $quotesraw);

shuffle($quotes);

if($quotes[50] == "") {
  die($quotes[10]);
} else {
  die($quotes[50]);
}


 ?>
Something went wrong -Redclock.fun right now
