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

        if($criteria) $agent['icon'] = $criteria -> icon;

        $out[] = $agent;
    }
    return $out;
}

function calculate($agents,$percentOf,$devider) {

    $out = array();


    foreach($agents as $agent){


        $notprsc = isset($agent['Nonprescriber'])?$agent['Nonprescriber']:0;
    //        $agent['ready_eff'] = (int) $agent['COUNTER_ready_eff'];
            $agent['ready_eff'] =(($agent['COUNTER_ready_eff'])/10);
    //        var_dump($agent['ready_eff']);
    //        $agent['status']  = ($agent['Dial']+$agent['Prescriber']+$notprsc)/($agent['ready_eff'])/$percentOf *100;
            $totalDials = $agent['Dial']+$agent['Prescriber']+$notprsc;
//            $time =  $agent['ready_eff']/3600;
            $tspeed = ($totalDials/($agent['ready_eff']/$devider));
//            $tspeed = ($totalDials/($agent['ready_eff']/3600));
            $stats = $tspeed/$percentOf*100;
            $agent['status']  = $stats;
            $agent['COUNTER_ready_eff'] = $agent['ready_eff'];
			$agent['HOURS']= $agent['ready_eff']/3600;
    //        var_dump($agent['status']);
    //        $agent['status'] = -15;


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