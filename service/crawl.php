<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);
session_start();

$out = new stdClass();
if(!isset($_GET['a'])) die('LOL');
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
if($_GET['a'] == 'get'){
	$list = array();	
	if(file_exists('crawl.json')){
		$data = json_decode(file_get_contents('crawl.json'))->data;
		foreach($data as $row) if($row->active)$list[]=$row->msg;
		//if(isset($_SESSION['crawl']))$_SESSION['crawl'] ++;
		//else $_SESSION['crawl'] =0;		
		
	}
	
	$out->list = $list;		
		echo json_encode($out);
	
	exit();
}
if($_GET['a'] == 'getall'){
	if(file_exists('crawl.json')){		
		echo file_get_contents('crawl.json');
		exit();
	}
	
}

$data = json_decode(file_get_contents('php://input'));

$user = $data->user;



if(!$user) die('OOPS');

$user->user = md5($user->user);
$user->pass = md5($user->pass);



//	$ar = explode('/',$_SERVER['DOCUMENT_ROOT']);
//	array_pop($ar);
//	$filename = implode('/',$ar).'/crawlusers.json';
//	if(!file_exists($filename)) die('no users set on server');



//	$users = json_decode(file_get_contents($filename))->data;

	$users = array();
	$u = new stdClass();
	$u->username = "4f5cec75c744bd39b5126debbb7cffb8";
	$u->password = "e3274be5c857fb42ab72d786e281b4b8";
	$users[] = $u;

	$pass=0;
	$data->user=0;
	$i=0;
	foreach($users as $val){
		$i++;
		if($user->user == $val->username && $user->pass == $val->password)$data->user = $i;
	}

if($data->user ===0){
	 $out->result = 'wrong username or password';
	 echo json_encode($out);
	 exit();
	
}

	if(file_exists('crawl.json')) copy('crawl.json','crawl'.time().'.json');	
	 $res = file_put_contents('crawl.json',json_encode($data));
	 
	 
	 if($res) $out->result='SAVED';
	 else $out->error= 'ERROR';
	 echo json_encode($out)
	 
	 

?>