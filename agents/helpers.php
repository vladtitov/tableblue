<?php
/**
 * Created by PhpStorm.
 * User: yrik6
 * Date: 07.06.2016
 * Time: 0:22
 */

function getXML($stamp){
    $url = AGENTS_URL.$stamp;
    $xml = simplexml_load_file($url);


	if(!$xml){
    logError ('No xml from server');
    exit;
}
if (count($xml->children()) == 0){
    logError ('Error parseFile: xml children');
    exit;
}
    return $xml;
}


function parseCSV($filemane){
	 $file = fopen($filemane, 'r');
 $data=array();
while (($line = fgetcsv($file)) !== FALSE) $data[]=$line;
fclose($file);

if(count($data) < 2) {
	echo json_encode(' error data length');
	exit;
}


while(count($data) && (count($header = array_shift($data))<5)){

}

$agents=array();
foreach($data as $node){
	 $item = new StdClass();
		$item->group = (int)$node[0];
        $item->name = $node[1];
        $item->id = (int)$node[2];
		$item->ext = $node[3];
        $item->busy_reason = $node[4];
		$item->state =$node[5];
		$item->split_skill = $node[6];
        $item->time= $node[7];
		$item->icon = $item->state.'.png';

		$item->full=$node;
        $agents[] = $item;

}
return $agents;

}
function adjustTime($ar,$stamp){
    $stamp = strtotime(str_replace('T',' ',$stamp));
    foreach ($ar as $val) if($val->time) $val->time = $stamp - strtotime(str_replace('T',' ',$val->time));
}

function setStates($ar,$satas){
    foreach ($ar as $val) if(isset($satas[$val->state]))$val->state = $satas[$val->state]->icon;
}

function setBusyReason($ar,$reasons){
    foreach ($ar as $val) if(isset($reasons[$val->busy_reason]))$val->busy_reason = $reasons[$val->busy_reason]->icon;
}

function parseFile($xml){
    $out = array();
    $states=array();
    foreach($xml->children() as $node){
        $item = new StdClass();
        $item->id = (int)$node->AgentID;
        $item->name = (string)$node->Name;
        $item->state = (string) $node->State;
        $item->busy_reason = (int) $node->MakeBusyReason;
        $item->time=(string)$node->EventDateTime;
        $out[] = $item;
    }
    return $out;
}

function jsonToTable($ar){
    $out ='<table>';
    $first = $ar[0];
    $out.='<tr>';
    foreach ($first as $key=>$val)   $out.='<td>'.$key.'</td>';
    $out.='</tr>';
    foreach ($ar as $row){
        $out.='<tr>';
        foreach ($row as $val) $out.='<td>'.$val.'</td>';
        $out.='</tr>';
    }
    return $out.'</table>';
}

function getObjectIndexed($filename){
    $ar = json_decode(file_get_contents($filename));
    $out = array();
    foreach($ar as $val)$out[$val->id] = $val;
    return $out;
}

function logError ($mess) {
    $mess = "\n\r".date("m.d.y H:m:s - ").$mess;
    error_log($mess, 3, 'error.log');
}