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

/*if(file_exists($stampReport.'.json')){
 $cuarrent = time();
 $filetime = filemtime($stampReport.'.json');
 if($cuarrent-$filetime < 1){
  echo file_get_contents($stampReport.'.json');
  exit();
 }
}*/

/// xmlReport start

 $xml = getXmlReport($filename);

if(!$xml){
 errorLog(' no xml from server');
 exit;
}

if (!checkTypeXml($xml, "Hello")) errorLog("checkTypeXml");

$out = new stdClass();

$arrind = makeArrInd($xml);

$rows = getPath($xml,'//DataDestination/Rows/Row');

$agents = createAgents($rows, $arrind);

//echo json_encode($agents);
//exit();
$indexed = indexById($agents);
$agents = formatArray($indexed);
//echo json_encode($agents);
//exit();

$agents = calculate($agents);

$agents = setCriteria($agents, $settings);

$out -> Report = $stampReport;
$out -> agents = $agents;// $agents;

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