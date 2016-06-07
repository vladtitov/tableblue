<?
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
include ('helpers.php');
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

$stamp = '2016-03-16T10:59:30';
if(isset($_GET['stamp'])) $stamp = $_GET['stamp'];

$result=0;
$out=new stdClass();
$xml =  getXML($stamp);
if ($xml == 0){
    exit;
}

$record = parseFile($xml, $stamp);
if ($record == 0){
    exit;
}
$out->stamp = $stamp;
$out->total= count($record->list);
$out->list = $record->list;
$out->states = $record->states;
echo json_encode($out);
?>