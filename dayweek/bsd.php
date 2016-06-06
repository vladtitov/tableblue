<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

$report = isset($_GET['report'])?$_GET['report']:0;

if(!$report) die('oops');
if($report=='w')$filename='examples/BSR-Wkly.xml';
else if($report=='d')$filename='examples/BSR-Dayly.xml';
else die("Need W or D!");



$xml = simplexml_load_file($filename);
$xml -> saveXML($report."temp.xml");


//if($_GET['report']=='raw'){
//
//	header('Content-type: application/json');
//	header("Access-Control-Allow-Origin: *");
//
//echo  json_encode($xml);
//exit();
//
//}

function getPath($xml,$path){
	$out= array();
	foreach($xml->xpath($path) as $node){		
		$item = array();
		foreach($node->attributes() as $key=>$val)	$item[$key]= (string)$val;		
		$out[] = $item;
	}
	return $out;
}

$out= new stdClass();
//$out->xml = $xml;
$Columns=getPath($xml,'//Columns/Column');
$Dimentions  = getPath($xml,'//Dimensions/Column');
$Columns = array_merge($Columns,$Dimentions );

$arind=array();
foreach($Columns as $val) $arind[$val['ColumnId']] = $val['FieldName'];


//$out->Columns=$Columns; 
//$out->Dimensions= getPath($xml,'//Dimensions/Column');
$rows= getPath($xml,'//DataDestination/Rows/Row');


$agents = array();
foreach($rows as $row){
	$item= array();
	foreach($row as $key=>$val)	$item[$arind[$key]] = $val;		
	$agents[] = $item;
}

$indexed = indexById($agents);
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
	
	
	if($agent['status']<86){
		$agent['icon'] = 'ok';
	}else if($agent['status']<95){
		$agent['icon'] = 'good';
	}else {
		$agent['icon'] = 'great';
	}
	
	
	$final[]=$agent;
}


$out->agents=$final;// $agents;

if(isset($_GET['view'])){
	$heads=explode(',','SERVICE,AGENT,AGENT_FULL_NAME,AGENT_POSITION_ID,TEAM,COUNTER_ready_eff,ready_eff,Flu Blitz Call,Prescriber,Non- prescriber,Dial,calc,status');
	$head='<tr>';
	foreach($heads as $h)$head.='<th>'.$h.'</th>';	
	$head.='</tr>';
	
	foreach($final as $row){
		$rows.='<tr>';		
		foreach($heads as $h)	$rows.='<td>'.$row[$h].'</td>';		
		$rows.='</tr>';	
	}
	
	echo '<table>'.$head.'<tbody>'.$rows.'</tbody></table>';
	exit();
	
}

//$out ->rows = getPath($xml,'//DataDestination/Rows/Row');

//$out->Columns=$Columns; 
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo  json_encode($out);


function indexById($agents){
	$agentsind=array();
	foreach($agents as $agent){	
			if(!$agentsind[$agent['AGENT_POSITION_ID']]){				
				$agentsind[$agent['AGENT_POSITION_ID']] = $agent;				
				//$agentsind[$agent['AGENT_POSITION_ID']][$agent['type']] = $agent['ACTIVITY_OUTCOME_CODE'];
				
			}
			$agentsind[$agent['AGENT_POSITION_ID']][$agent['type']] = (int) $agent['ACTIVITY_OUTCOME_CODE'];
			//$agentsind[$agent['AGENT_POSITION_ID']]['total'] +=(int)$agent['ACTIVITY_OUTCOME_CODE'];
			
	
		//$type = array();
		//$type['type'] = $agent['type'];
		//$type['value'] = $agent['ACTIVITY_OUTCOME_CODE'];
		//$agentsind[$agent['AGENT_POSITION_ID']]['activity'] [] = $type;
	}
	
	return 	$agentsind;
	
}
function formatTypes($agents,$agentsind){
	
	foreach($agents as $agent){
		//$agentsind[$agent['AGENT_POSITION_ID']]
	}
}

 ?>