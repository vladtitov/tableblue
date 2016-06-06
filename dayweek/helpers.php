<?php
/**
 * Created by PhpStorm.
 * User: админ
 * Date: 06.06.2016
 * Time: 22:09
 */

function xmlReport($stampReport) {
    $url = "http://callcenter.front-desk.ca//dashboard2/bsd.php?report=".$stampReport;

    $filename='examples/BSR-Dayly.xml';
    $output = file_get_contents($filename);

// create curl resource
    $ch = curl_init();
// set url
    curl_setopt($ch, CURLOPT_URL, $url);
//return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// $output contains the output string
//    $output = curl_exec($ch);

    $xml = simplexml_load_string($output);
    $xml -> saveXML($stampReport."temp.xml");

// close curl resource to free up system resources
    curl_close($ch);
    return $xml;
}

function checkTypeXml($xml, $type){
    return true;
}

function makeArrInd($xml){
    $Columns=getPath($xml,'//Columns/Column');
    $Dimentions  = getPath($xml,'//Dimensions/Column');
    $Columns = array_merge($Columns,$Dimentions );

    $arrind=array();
    foreach($Columns as $val) $arrind[$val['ColumnId']] = $val['FieldName'];

    return $arrind;
}

function getCriteria ($criteria, $agent) {
    foreach ($criteria as $item) {
        if ($agent["status"] < $item->max){
            return $item;
        }
    }
    return 0;
}

function setCriteria($agents, $settings) {
    foreach ($agents as $agent) {
        $agent -> criteria = getCriteria($settings->criteria, $agent);
    }
}

function createAgents($rows, $arind) {
    $agents = array();
    foreach($rows as $row){
        $item= array();
        foreach($row as $key=>$val)	$item[$arind[$key]] = $val;
        $agents[] = $item;
    }
    return $agents;
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

function indexById($agents){
    $agentsind=array();
    foreach($agents as $agent){
        $id = $agent['AGENT_POSITION_ID'];

        if (!isset($agentsind[$id])) $agentsind[$id] = $agent;

        $agentsind[$id][$agent['type']] = (int) $agent['ACTIVITY_OUTCOME_CODE'];
    }

    return 	$agentsind;

}
function formatTypes($agents,$agentsind){
    foreach($agents as $agent){
        //$agentsind[$agent['AGENT_POSITION_ID']]
    }
}

function errorLog($message){
    error_log($message, 3, "errorlog.log");
    die ($message);
}

function myLog($message){
    error_log($message, 3, "log.log");
}

?>