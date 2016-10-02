<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);
$ini_array = parse_ini_file("../config.txt");
define('DAILY_URL',$ini_array['DAILY_URL']);
define('WEEKLY_URL',$ini_array['WEEKLY_URL']);
include "helpers.php";
include "calculator.php";

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
$stampReport = 'w';
if(isset($_GET['report']))$stampReport = $_GET['report'];


if($stampReport=='w') $filename = WEEKLY_URL;
else if($stampReport=='d') $filename =DAILY_URL;
else die("Need W or D!");



/*if(file_exists($stampReport.'.json')){
 $current = time();
 $filetime = filemtime($stampReport.'.json');
 if($current-$filetime < 60){
  echo file_get_contents($stampReport.'.json');
  exit();
 }
}*/

/// xmlReport start

// $xml = getXmlReport($filename);
$xml = @simplexml_load_file($filename);
//exit;
if(!$xml){
 errorLog(' no xml from server');
 
 exit;
}

$out = new stdClass();

$arrind = makeArrInd($xml);

if($arrind === 0) {
 errorLog(' no Columns or Dimensions in xml');
 exit;
}

$rows = getPath($xml,'//DataDestination/Rows/Row');

if(!$rows){
 errorLog(' no Rows in xml');
 exit;
}

$agents = createAgents($rows, $arrind);

$indexed = indexById($agents);
$agents = formatArray($indexed);





$settings = json_decode(file_get_contents("settings.json"));


$agents = calculate($agents,$settings->percentOf);

//$agents = setCriteria($agents,$settings);

$out -> Report = $stampReport;

$out -> agents = $agents;

$out -> count = count($agents);

//file_put_contents($stampReport.'.json', json_encode($out));

echo json_encode($out);

function errorLog($message){
 error_log("\n\r".date("Y-m-d H:i:s")." ".$message, 3, "error.log");
 die ($message);
}

function myLog($message){
 error_log("\n\r".date("Y-m-d H:i:s")." ".$message, 3, "log.log");
}

 ?>