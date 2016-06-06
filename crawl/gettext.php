<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

$ar = json_decode(file_get_contents('crawl.json'));
$out = array ();
foreach ($ar as $item ) if ($item -> active) $out [] = $item -> msg;
echo json_encode ($out);