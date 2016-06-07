<?php
/**
 * Created by PhpStorm.
 * User: yrik6
 * Date: 07.06.2016
 * Time: 0:22
 */

function getXML($stemp){
    $url = "http://callcenter.front-desk.ca/agents/examples.php?stamp=".$stemp;
    try {
        $xml = simplexml_load_file($url);
    }
    catch (Exception $e) {
        logError ('Error getXML');
        return 0;
    }
    return $xml;
}


function parseFile($xml,$satamp){
    $satamp = strtotime(str_replace('T',' ',$satamp));
    $list = array();
//    $mb = getAsObject('MakeBusyReason.json');
//    $ps = getAsObject('PersonState.json');
    
//    if ($mb == 0 || $ps == 0) {
//        logError ('Error parseFile: MakeBusyReason.json PersonState.json');
//        return 0;
//    }
    
    $states=array();
    $out=new stdClass();
    
    if (count($xml->children()) > 0){
        logError ('Error parseFile: xml children');
        return 0;
    }
    
    foreach($xml->children() as $node){
        $item = new StdClass();
        $item->id = (int)$node->AgentID;

        $state = (string) $node->State;
        if(isset($ps[$state])){

            $item->icon = $ps[$state]->icon;
            $item->msg = $ps[$state]->msg;
            $item->sort = $ps[$state]->id;
            if(isset($states[$item->icon]))$states[$item->icon]++;
            else $states[$item->icon]=1;
        }
        $code = (int) $node->MakeBusyReason;
        $item->b_r = $code;
        
        $time = (string)$node->EventDateTime;
        if($time){
            $time =  strtotime(str_replace('T',' ',$time));
            $item->t = $satamp-$time;
        }
        $list[] = $item;
    }
    $out->states = $states;
    $out->list = $list;
    return $out;
}

function getAsObject($filename){
    $ar = json_decode(file_get_contents($filename));
    $out = array();
    foreach($ar as $val)$out[$val->code] = $val;
    return $out;
}

function getObjectById($filename){
    $ar = json_decode(file_get_contents($filename));
    $out = array();
    foreach($ar as $val)$out[$val->id] = $val;
    return $out;
}

function logError ($mess) {
    $d = getdate();
    $mess = "\n\r".$d[mday]."-".$d[mon]."-".$d[year]." ".$d[hours].":".$d[minutes]." - ".$mess;
    error_log($mess, 3, 'error.log');
}