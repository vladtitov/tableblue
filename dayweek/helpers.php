<?php
/**
 * Created by PhpStorm.
 * User: админ
 * Date: 06.06.2016
 * Time: 22:09
 */


function getXmlReport($stampReport) {
    $url = "http://callcenter.front-desk.ca/data/".$stampReport;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    $xml = @simplexml_load_string($output);

    curl_close($ch);
    return $xml;
}

function makeArrInd($xml){
    $Columns = getPath($xml,'//Columns/Column');
    if(!$Columns) return 0;
    $Dimentions = getPath($xml,'//Dimensions/Column');
    if(!$Dimentions) return 0;
    $Columns = array_merge($Columns, $Dimentions);

    $arrind = array();
    foreach($Columns as $val) $arrind[$val['ColumnId']] = $val['FieldName'];

    return $arrind;
}

function getPath($xml,$path){
    $out= array();
    foreach($xml->xpath($path) as $node){
        $item = array();
        foreach($node->attributes() as $key=>$val)	$item[$key]= (string)$val;
        $out[] = $item;
    }
    return $out;
}

function createAgents($rows, $arind) {
    $agents = array();
    foreach($rows as $row){
        $item = array();
        foreach($row as $key=>$val)	$item[$arind[$key]] = $val;
        $agents[] = $item;
    }
    return $agents;
}

function indexById($agents){
    $agentsind=array();
    foreach($agents as $agent){
        $id = $agent['AGENT_POSITION_ID'];

        if (!isset($agentsind[$id])){
            $agentsind[$id] = $agent;
        }

        $agentsind[$id][$agent['type']] = (int) $agent['ACTIVITY_OUTCOME_CODE'];
    }
    return 	$agentsind;
}

function formatArray($a) {
    $out = array();
    foreach($a as $key => $agent) {
        unset($agent['ACTIVITY_OUTCOME_CODE']);
        unset($agent['type']);
        unset($agent['TEAM']);
        unset($agent['SERVICE']);

        $agent['id'] = (int) $agent['AGENT_POSITION_ID'];

        if (!isset($agent['Dial'])) $agent['Dial'] = 0;
        if (!isset($agent['Prescriber'])) $agent['Prescriber'] = 0;
        if (!isset($agent['Non- prescriber'])) $agent['Non- Prescriber'] = 0;

        $ar = explode(' ',$agent['AGENT_FULL_NAME']);

        $agent['name']= $ar[0];
        if(count($ar)>1) $agent['name'] .= ' '.substr($ar[1],0,1);
        unset($agent['AGENT_FULL_NAME']);

//        var_dump($agent);
        $out[] = $agent;
    }
    return $out;
}

?>