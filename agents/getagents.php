<?
session_start();
/*ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);*/

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

/*if(file_exists('agents.json')) {
    $curent = time();
    $file_time = filemtime('agents.json');
    if($curent-$file_time<60){
        echo file_get_contents('agents.json');
        exit;
    }
}*/

$ini_array = parse_ini_file("../config.txt");
define('AGENTS_URL',$ini_array['AGENTS_URL']);
define('INV',$ini_array['INV']);
include ('helpers.php');


if(INV == 'demo'){
    $stamp = '2016-03-16T08:59:30';
    $start_time =  strtotime(str_replace('T',' ',$stamp));
    if(isset($_SESSION['current_time'])) $_SESSION['current_time']+=50;
    else  $_SESSION['current_time'] = $start_time;

    $current_time =  $_SESSION['current_time'];
    if($current_time - $start_time>60*60*5) $_SESSION['current_time'] = $start_time;
    $current_time+=60;
    $stamp = date('Y-m-d H:i:s',$current_time);
    $stamp = str_replace(' ','T',$stamp);  
}

//echo $stamp;


if(isset($_GET['stamp'])) $stamp = $_GET['stamp'];

$result=0;
$out=new stdClass();

$xml = getXML($stamp);
if(!$xml){
    logError ('No xml from server');
    ecit;
}
if (count($xml->children()) == 0){
    logError ('Error parseFile: xml children');
    exit;
}
$reasons = getObjectIndexed('MakeBusyReason.json');
$states = getObjectIndexed('PersonState.json');

if (!$reasons || !$states) {
    logError ('Error parseFile: MakeBusyReason.json PersonState.json');
    exit;
}


$agents = parseFile($xml);

setStates($agents,$states);

setBusyReason($agents,$reasons);

adjustTime($agents,$stamp);

$out->stamp = $stamp;
$out->total= count($agents);
$out->list = $agents;


file_put_contents('agents.json', json_encode($out));

echo json_encode($out);
?>