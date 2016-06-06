<?php

$stamp = '2016-03-15T10:59:30';
$limit = 3;

$res = getRecord($stamp,$limit);

$i=1;
$out=array();
foreach ($res as $xml){
    $rawdara =  (string)$xml->rawdata;
 $out[]    = file_put_contents('agents'.$i++.'.xml',$rawdara);
}
echo json_encode($out);

function getRecord($stamp,$limit){
    $dbname = 'frontdes_callcenter';
    $table='agentsraw1';
    $user = getUser();
    $db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);
    $time = date(str_replace('T',' ',$stamp));
    $sql="SELECT rawdata FROM $table  WHERE stamp > '$time' LIMIT ".$limit;
    $res = $db->query($sql);
    if(!$res) return $db->errorInfo();
    return  $res->fetchAll(PDO::FETCH_OBJ);

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