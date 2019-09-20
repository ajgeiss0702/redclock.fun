<?php
if(!isset($_GET['yes'])) {
  //die("<script>location.href='/'</script>");
}
 ?>
<!DOCTYPE html>
<html>
	<head>
		<title>Bonk.io - Just bonk!</title>
		<meta name="Description" content="Bonk without ads. Only bonk. Works with game links. ">
		<link rel="icon" type="image/png" href="https://bonk.io/tt/favicon-32x32.png">
		<style>
		body, html {
			margin: 0;
			min-height: 100%;
			overflow-y: hidden;
		}
		</style>
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-106568388-4"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'UA-106568388-4');
		</script>
	</head>
	<body>
		<object type="application/x-shockwave-flash" data="//cache.armorgames.com/files/games/bonkio-18093.swf" style="width: 100%; height: 100vh;">
				<param name="movie" value="//cache.armorgames.com/files/games/bonkio-18093.swf">
				<param name="FlashVars" value="autoconnectroomid=<?php
				if(isset($_GET['r'])) {
					print($_GET['r']);
				}
				?>&autoconnectroompassword=">
				<param name="wmode" value="direct">
				<param name="allowscriptaccess" value="always">

		</object>
	</body>
</html>
