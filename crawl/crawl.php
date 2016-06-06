<?php
	//ini_set('display_errors', 1);
	//error_reporting(E_ALL ^ E_NOTICE);
	
	require('../users/user.php');
	
	$out = new stdClass();
	
	$user = new User();
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	
	if(!$user->isAdmin()) {
		$out->error = 'Please login';
	}
	else {
		if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$out = file_get_contents('crawl.json');
		} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			if (file_exists('crawl.json')) copy('crawl.json', 'crawl' . time() . '.json');
			$data = json_decode(file_get_contents('php://input'));
			$out->result = file_put_contents('crawl.json', json_encode($data));
		}
	}
	echo $out;
?>