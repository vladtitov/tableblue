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
$a='getfiles';
if(isset($_GET['a'])) $a = $_GET['a'];

if($a == 'upload'){
	$file = $_FILES["file"];
	$out=new stdClass();
				
		if ($file["error"] > 0){
			$out->error= $file["error"];
			return $out;
		}
		
		//$filename= isset($_GET['filename'])?$_GET['filename']:$file["name"];	
		$filename=$file["name"];				
		if(move_uploaded_file($file["tmp_name"],'../'.$folder.'/'.$filename)){
			$out->success='success';
			$out->result=$folder.'/'.$filename;
			$out->filename = $filename;
		}
		
		echo json_encode($out);
		exit();
		
	
}else if($a == 'delete'){
	$filename = $_GET['filename'];
	$out=new stdClass();
	//if(strpos('/',$filename) !== NULL) return $out;
	
	$file = '../'.$folder.'/'.$filename;
	$res=0;
	if(file_exists($file)) $res = unlink($file);	
	if($res){
		$out->success='success';
		$out->result='removed';
	}else $out->eroor = $file;
	
	echo json_encode($out);
		exit();
}
else if($a == 'rename'){
	$data = json_decode(file_get_contents('php://input'));
	$newname = $data->newname;
	$oldname = $data->oldname;
	if($newname == $oldname){
		$out->success='samename';
		echo json_encode($out);
		exit();
		
	}
	$newfile = '../'.$folder.'/'.$newname;
	$oldfile = '../'.$folder.'/'.$oldname;
	$replaced=0;
	if(file_exists($newfile))$replaced = unlink($newfile);
	$out=new stdClass();
	$res = rename($oldfile,$newfile);	
	if($res) {
		$out->success='success';	
		$out->newname = $folder.'/'.$newname;
		if($replaced)$out->replaced = $newname;
	}
	echo json_encode($out);
		exit();
}


$out->assets = getAssets($prefix,$folder);

echo json_encode($out);

function getAssets($prefix,$folder){
	$ar = scandir($prefix.$folder);
	$out=array();
	foreach($ar as $file)if(!is_dir($file)) $out[] = $folder.'/'.$file;
	return $out;
}

function saveAsset($filename){
	
	
}
function deleteAsset(){
	
	
}



	 

?>