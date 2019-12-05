<?php
$url = 'https://gitlab.com/api/v4/projects/12062202/jobs/artifacts/master/raw/dist/Red%20Clock%20Installer.exe?job=build';

$opts = [
    "http" => [
        "method" => "GET",
        "header" => "PRIVATE-TOKEN: LgzKEd2BTX9Lyc_1kJJW"
    ]
];

$context = stream_context_create($opts);
$content = file_get_contents($url, false, $context);

header("Content-type: application/exe");
header("Content-Disposition: attachment; filename=Red Clock Installer.exe");
header("Content-Length: ".strlen($content));

echo $content;
