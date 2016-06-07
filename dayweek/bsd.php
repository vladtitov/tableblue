<?php
include "helpers.php";
include "calculator.php";
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

$stampReport = isset($_GET['report'])?$_GET['report']:0;

if(!$stampReport) die('oops');
if($stampReport=='w') $filename = 'BSR-Wkly.xml';
else if($stampReport=='d') $filename = 'BSR-Dayly.xml';
else die("Need W or D!");

$settings = json_decode(file_get_contents("settings.json"));

if(file_exists($stampReport.'.json')){
 $cuarrent = time();
 $filetime = filemtime($stampReport.'.json');
 if($cuarrent-$filetime < 60){
  echo file_get_contents($stampReport.'.json');
  exit();
 }
}

/// xmlReport start

 $xml = getXmlReport($filename);

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


$agents = calculate($agents);

$agents = setCriteria($agents, $settings);

$out -> Report = $stampReport;

$out -> agents = $agents;// $agents;

$out -> count = count($agents);

file_put_contents($stampReport.'.json', json_encode($out));

echo json_encode($out);

function errorLog($message){
 error_log("\n\r".date("Y-m-d H:i:s")." ".$message, 3, "errorlog.log");
 die ($message);
}

function myLog($message){
 error_log("\n\r".date("Y-m-d H:i:s")." ".$message, 3, "log.log");
}

 ?>