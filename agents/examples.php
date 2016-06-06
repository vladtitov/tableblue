<?php
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

if(!isset($_GET['stamp'])) die('stamp');

$stamp = $_GET['stamp'];

$limit = 10;

$res = getRecord($stamp,$limit);
echo $res;

function getRecord($stamp,$limit){
    $dbname = 'frontdes_callcenter';
    $table='agentsraw1';
    $user = getUser();
    $db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);
    $time = date(str_replace('T',' ',$stamp));
    $sql="SELECT * FROM $table  WHERE stamp > '$time' LIMIT ".$limit;
    $res = $db->query($sql);
    if(!$res) return $db->errorInfo();
    return  $res->fetchAll(PDO::FETCH_OBJ)[0]->rawdata;
}

function getUser(){
    $root = (string)$_SERVER['DOCUMENT_ROOT'];
    $ind = strpos($root,'public_html');
    if($ind===FALSE) $ind = strpos($root,'www');
    $root = substr($root,0,$ind);
    $users_file = $root.'user.json';
    return json_decode(file_get_contents($users_file));
}
?>