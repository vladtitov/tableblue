<?
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

//date=2016-03-15T7:58:34
$date=isset($_GET['date'])?$_GET['date']:0;
if($date===0) die('hoh');
$type = isset($_GET['type'])?$_GET['type']:0;

$result=0;
$out=new stdClass();
$record =  getRecord($date);



$out->id= $record->id;
$out->stamp = $record ->stamp;

if($type && $type=='raw')$result = simplexml_load_string($record->rawdata);
else{
	$out->rand = rand(1,3);
	 $result = parseFile($record->rawdata,$out->stamp);
	 $result->list =  makeLengthDifferent($result->list,$out->rand);
	 
}



$out->total= count($result->list);
$out->result = $result; 

function makeLengthDifferent($ar,$rand){
	$out = array();
	$total = count($ar);
	
	
	for($i=0;$i<$total;$i++){
		if($i % $rand){
			
		}else  $out[] = $ar[$i];
		
	}
	return $out;	
}

function getRecord($id){
	$dbname = 'frontdes_callcenter';
	$table='agentsraw1';
	$user = getUser();
	$db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);
	
	switch($id){
		case 'last':
		$sql="SELECT * FROM $table  ORDER BY id DESC LIMIT 1";
		break;
		default:
		$time = date(str_replace('T',' ',$id));
		$sql="SELECT * FROM $table  WHERE stamp > '$time' LIMIT 1";
		break;
		
	}
	//return $sql;
	$res = $db->query($sql);
	if(!$res) return $db->errorInfo();
	
	return  $res->fetchAll(PDO::FETCH_OBJ)[0];
	
}

function getUser(){
	$root = (string)$_SERVER['DOCUMENT_ROOT'];
		$ind = strpos($root,'public_html');
		if($ind===FALSE) $ind = strpos($root,'www');
		$root = substr($root,0,$ind);
		$users_file = $root.'user.json';	
return json_decode(file_get_contents($users_file));
}

function parseFile($raw,$satamp){
	$satamp =  strtotime($satamp);
	
	$xml = simplexml_load_string($raw);
	$list = array();
	//$mb = getAsObject('MakeBusyReason.json');
	//$ps = getAsObject('PersonState.json');
	$aux = getObjectById('auxReason.json');
	$states=array();
	$out=new stdClass();
	foreach($xml->children() as $node){
		$item = new StdClass();
		//$item->name = (string)$node->Name;
		$item->id = (int)$node->AgentID;
		$item->name = (string)explode(',',$node->Name)[0];
		
		$sec = rand(10,60*10);
		//if($sec>50*5)
		
		$item->time=$sec;		
		$state = rand(1,9);;//(string)$node->State;
		//$item->icon = rand(1,9);
		$item->fa = $aux [$state]->fa;
		$item->aux =  $aux [$state]->code;
		 $item->color = isset($aux [$state]->color)?$aux [$state]->color:'green';
		 $item->time_color=$sec>50*5?'red':$item->color;
		//if(isset($ps[$state])){	
			//$item->aux = substr($ps[$state]->msg,0,10);
			//$item->icon = $ps[$state]->icon;
		//	$item->msg = $ps[$state]->msg;
			//$item->sort = $ps[$state]->id;
			//if(isset($states[$item->icon]))$states[$item->icon]++;
			//else $states[$item->icon]=1;
		//}		 
		$code = (int) $node->MakeBusyReason;
		//$item->b_r = $code;
		//$item->code = isset($mb[$code])?$mb[$code]:0;		
		$time = (string)$node->EventDateTime;
		if($time){
			$time =  strtotime(str_replace('T',' ',$time));		
			//$item->t = $satamp-$time;
		}
		
		//if($time)$item->timeout = getTimeout($servertime,$time);
		$list[] = $item;	
	}
		
	
	$out->states = $states;
	$out->list = $list;
	return $out;
	//return $mb;

}

function getAsObject($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->code] = $val;
	return $out;
}
function getObjectById($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->id] = $val;
	return $out;
}

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>