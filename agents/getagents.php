<?
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

$stamp = '2016-03-16T10:59:30';
if(isset($_GET['stamp'])) $stamp = $_GET['stamp'];

$result=0;
$out=new stdClass();
$xml =  getXML($stamp);
$record = parseFile($xml, $stamp);

//var_dump($xml);
//echo (json_encode($record));
//exit;

//$out->id= $record->id;
$out->stamp = $stamp;
$out->total= count($record->list);
$out->list = $record->list;
$out->states = $record->states;


function getXML($stemp){

	$url = "http://callcenter.front-desk.ca/agents/examples.php?stamp=".$stemp;

//// create curl resource
//	$ch = curl_init();
//// set url
//	curl_setopt($ch, CURLOPT_URL, $url);
////return the transfer as a string
//	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//// $output contains the output string
//	$output = curl_exec($ch);

	$xml = simplexml_load_file($url);

	return $xml;
}


function parseFile($xml,$satamp){
//	$satamp =  strtotime($satamp);
	
//	$xml = simplexml_load_string($raw);
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

//		$item->name = (string)explode(',',$node->Name)[0];
		
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

function getObjectById($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->id] = $val;
	return $out;
}


echo json_encode($out);
?>