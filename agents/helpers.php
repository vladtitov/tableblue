<?php
/**
 * Created by PhpStorm.
 * User: yrik6
 * Date: 07.06.2016
 * Time: 0:22
 */

function getXML($stemp){
    $url = "http://callcenter.front-desk.ca/agents/examples.php?stamp=".$stemp;
    $xml = simplexml_load_file($url);
    return $xml;
}

function parseFile($xml,$satamp, $mb, $ps){
    $satamp = strtotime(str_replace('T',' ',$satamp));
    $list = array();
    
    $states=array();
    $out=new stdClass();
    
    if (count($xml->children()) == 0){
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
    $mess = "\n\r".date("m.d.y H:m:s - ").$mess;
    error_log($mess, 3, 'error.log');
}