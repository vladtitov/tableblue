<?php
include "helpers.php";
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

//header('Content-type: application/json');
//header("Access-Control-Allow-Origin: *");

$stampReport = isset($_GET['report'])?$_GET['report']:0;

if(!$stampReport) die('oops');
if($stampReport=='w')$filename='examples/BSR-Wkly.xml';
else if($stampReport=='d')$filename='examples/BSR-Dayly.xml';
else die("Need W or D!");

$xml = xmlReport($stampReport);

if (!checkTypeXml($xml, "Hello")) errorLog("checkTypeXml");

$out= new stdClass();

$arrind = makeArrInd($xml);

$rows= getPath($xml,'//DataDestination/Rows/Row');

$agents = createAgents($rows, $arrind);

$settings = json_decode(file_get_contents("settings.json"));

//echo json_encode($agents);
//exit();
$indexed = indexById($agents);
//echo json_encode($indexed);
//exit();
$final= array();
foreach($indexed  as $agent){
	unset($agent['ACTIVITY_OUTCOME_CODE']);
	unset($agent['type']);
	$agent['ready_eff'] = (int) $agent['COUNTER_ready_eff']/1000;
	$agent['calc'] = ($agent['Dial']+$agent['Prescriber']+$agent['Non- prescriber'])/($agent['ready_eff']/12);

	//$eff =
	$agent['status'] = round($agent['calc']*1000)/1000;
	$ar = explode(' ',$agent['AGENT_FULL_NAME']);

	$agent['name']= $ar[0];
	if(count($ar)>1) $agent['name'] .= ' '.substr($ar[1],0,1);
	unset($agent['AGENT_FULL_NAME']);

//	if($agent['status']<86){
//		$agent['icon'] = 'ok';
//	}else if($agent['status']<95){
//		$agent['icon'] = 'good';
//	}else {
//		$agent['icon'] = 'great';
//	}


	$final[]=$agent;
}

$out->agents=$final;// $agents;

echo  json_encode($out);

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