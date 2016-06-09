<?php
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
require('../users/user.php');

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

$out = new stdClass();
$user = new User();
if(!$user->isAdmin()){
	$out->error = 'Please login';
	echo json_encode($out);
	exit();
}
$prefix='../';
$folder = 'icons';
$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET'){
	$mass = getAssets($prefix,$folder);
	$out->assets = makeObjects($mass,$folder);
	echo json_encode($out);
}
else if ($method == 'POST') {
	$file = $_FILES["file"];
	$out=new stdClass();

	if ($file["error"] > 0){
		$out->error= $file["error"];
	}
	else {
		$filename= isset($_GET['filename'])?$_GET['filename']:$file["name"];
		if (move_uploaded_file($file["tmp_name"], '../' . $folder . '/' . $filename)) {
			$out->success = 'success';
			$out->result = $folder . '/' . $filename;
			$out->filename = $filename;
		}
	}
	echo json_encode($out);
}

function makeObjects($mass, $folder) {
	$out = array();
	foreach ($mass as $val){
		$obj = new stdClass();
		$obj->id = $val;
		$obj->icon = $folder.'/'.$val;
		$obj->name = substr($val, 0, -4);
		$obj->filename = $val;
		$out[] = $obj;
	}
	return $out;
}

function getAssets($prefix,$folder){
	$ar = scandir($prefix.$folder);
	$out=array();
	foreach($ar as $file)if(!is_dir($file)) $out[] = $file;
	return $out;
}
?>