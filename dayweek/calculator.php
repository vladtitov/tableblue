<?php
/**
 * Created by PhpStorm.
 * User: админ
 * Date: 07.06.2016
 * Time: 2:09
 */


function getCriteria ($criteria, $agent) {
    foreach ($criteria as $item) {
        if ($agent["status"] < $item->max){
            return $item;
        }
    }
    return 0;
}

function setCriteria($agents, $settings) {
    $out = array();
    foreach ($agents as $agent) {

        $criteria = getCriteria($settings->criteria, $agent);

        $agent['icon'] = $criteria -> icon;

        $out[] = $agent;
    }
    return $out;
}

function calculate($agents,$percentOf) {

    $out = array();


    foreach($agents as $agent){


$notprsc = isset($agent['Nonprescriber'])?$agent['Nonprescriber']:0;
        $agent['ready_eff'] = (int) $agent['COUNTER_ready_eff']/3600;
        $agent['status']  = ($agent['Dial']+$agent['Prescriber']+$notprsc)/($agent['ready_eff'])/$percentOf *100;

      /// $agent['status'] = round($agent['calc']*1000)/1000;

        $out[] = $agent;
    }
    return $out;
}

//

//function test($stampReport, $agents){
//    if($stampReport == 'w'){
//        $str = json_encode($agents);
//        $agentsdouble = json_decode($str);
//        foreach($agents as $agent) {
//            $agent['id'] = $agent['id'] + 1;
//            $agentsdouble[] = $agent;
//        }
//        return $agentsdouble;
//    } else {
//        return $agents;
//    }
//}