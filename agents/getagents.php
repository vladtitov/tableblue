<?
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

if(file_exists('agents.json')) {
    $curent = time();
    $file_time = filemtime('agents.json');
    if($curent-$file_time<60){
        echo file_get_contents('agents.json');
        exit;
    }
}


include ('helpers.php');
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

$stamp = '2016-03-16T10:59:30';
if(isset($_GET['stamp'])) $stamp = $_GET['stamp'];

$result=0;
$out=new stdClass();
try {
    $xml = getXML($stamp);
}
catch (Exception $e) {
    logError ('Error getXML');
    exit;
}

$mb = getAsObject('MakeBusyReason.json');
$ps = getAsObject('PersonState.json');
if ($mb == 0 || $ps == 0) {
    logError ('Error parseFile: MakeBusyReason.json PersonState.json');
    exit;
}

$record = parseFile($xml, $stamp, $mb, $ps);
if ($record == 0){
    logError ('Error parseFile: xml children');
    exit;
}

$out->stamp = $stamp;
$out->total= count($record->list);
$out->list = $record->list;
$out->states = $record->states;

file_put_contents('agents.json', json_encode($out));

echo json_encode($out);
?>