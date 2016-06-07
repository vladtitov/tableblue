<?php
include "helpers.php";
include "calculator.php";
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

$stampReport = isset($_GET['report'])?$_GET['report']:0;

//var_dump($stampReport);
//exit();

if(!$stampReport) die('oops');
if($stampReport=='w') $filename = 'examples/BSR-Wkly.xml';
else if($stampReport=='d') $filename = 'examples/BSR-Dayly.xml';
else die("Need W or D!");

$settings = json_decode(file_get_contents("settings.json"));

if(file_exists($stampReport.'.json')){
 $cuarrent = time();
 $filetime = filemtime($stampReport.'.json');
 if($cuarrent-$filetime < 1){
  echo file_get_contents($stampReport.'.json');
  exit();
 }
}

/// xmlReport start
$xml = getXmlReport($stampReport);

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

////////////////////////  END CONTROLER  //////////////////




//$output = json_decode($output);
//
//$agents = $output -> agents;


//foreach ($agents as $agent) {
//	var_dump($agent -> status);
//
//	$agent -> icon = "hello";
//	$agent -> state =
//	var_dump($agent);
//}






//if($_GET['report']=='raw'){
//
//	header('Content-type: application/json');
//	header("Access-Control-Allow-Origin: *");
//
//echo  json_encode($xml);
//exit();
//
//}


//if(isset($_GET['view'])){
//	$heads=explode(',','SERVICE,AGENT,AGENT_FULL_NAME,AGENT_POSITION_ID,TEAM,COUNTER_ready_eff,ready_eff,Flu Blitz Call,Prescriber,Non- prescriber,Dial,calc,status');
//	$head='<tr>';
//	foreach($heads as $h)$head.='<th>'.$h.'</th>';
//	$head.='</tr>';
//
//	foreach($final as $row){
//		$rows.='<tr>';
//		foreach($heads as $h)	$rows.='<td>'.$row[$h].'</td>';
//		$rows.='</tr>';
//	}
//
//	echo '<table>'.$head.'<tbody>'.$rows.'</tbody></table>';
//	exit();
//
//}

//$out ->rows = getPath($xml,'//DataDestination/Rows/Row');

//$out->Columns=$Columns; 

 ?>