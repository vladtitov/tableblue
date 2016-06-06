<?
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);


$date=isset($_GET['date'])?$_GET['date']:0;
if($date===0) die('hoh');
$type = isset($_GET['type'])?$_GET['type']:0;

$result=0;
$out=new stdClass();
$record =  getRecord($date);



$out->id= $record->id;
$out->stamp = $record ->stamp;

if($type && $type=='raw')$result = simplexml_load_string($record->rawdata);
else $result = parseFile($record->rawdata,$out->stamp);
$out->result = $result; 

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
	$ar = explode('/',getenv('DOCUMENT_ROOT'));
		array_pop($ar);
	$user = implode('/',$ar).'/user.json';
return json_decode(file_get_contents($user));
}

function parseFile($raw,$satamp){
	$satamp =  strtotime($satamp);
	
	$xml = simplexml_load_string($raw);
	$list = array();
	$mb = getAsObject('MakeBusyReason.json');
	$ps = getAsObject('PersonState.json');
	$states=array();
	$out=new stdClass();
	foreach($xml->children() as $node){
		$item = new StdClass();
		//$item->name = (string)$node->Name;
		$item->id = (int)$node->AgentID;
		
		$state = (string) $node->State;
		if(isset($ps[$state])){	
				
			$item->icon = $ps[$state]->icon;
			$item->msg = $ps[$state]->msg;
			$item->sort = $ps[$state]->id;
			if(isset($states[$item->icon]))$states[$item->icon]++;
			else $states[$item->icon]=1;
		}		 
		$code = (int) $node->MakeBusyReason;
		$item->b_r = $code;
		//$item->code = isset($mb[$code])?$mb[$code]:0;		
		$time = (string)$node->EventDateTime;
		if($time){
			$time =  strtotime(str_replace('T',' ',$time));		
			$item->t = $satamp-$time;
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

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>