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
    $out=array();
    foreach ($agents as $agent) {

        $criteria = getCriteria($settings->criteria, $agent);

        $agent['icon'] = $criteria -> icon;

        $out[] = $agent;
    }
    return $out;
}

function calculate($agents) {
    $out=array();

    foreach($agents as $agent){

        $agent['ready_eff'] = (int) $agent['COUNTER_ready_eff']/1000;
        $agent['calc'] = ($agent['Dial']+$agent['Prescriber']+$agent['Non- prescriber'])/($agent['ready_eff']/12);

        $agent['status'] = round($agent['calc']*1000)/10;

        $out[] = $agent;

//	if($agent['status']<86){
//		$agent['icon'] = 'ok';
//	}else if($agent['status']<95){
//		$agent['icon'] = 'good';
//	}else {
//		$agent['icon'] = 'great';
//	}

    }

    return $out;
}