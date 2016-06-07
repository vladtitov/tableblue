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

function calculate($agents) {
    $out = array();

    foreach($agents as $agent){

        $agent['ready_eff'] = (int) $agent['COUNTER_ready_eff']/1000;
        $agent['calc'] = ($agent['Dial']+$agent['Prescriber']+$agent['Non- prescriber'])/($agent['ready_eff']/12);

        $agent['status'] = round($agent['calc']*1000)/10;

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