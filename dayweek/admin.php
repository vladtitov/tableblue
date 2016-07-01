<?php
require('../users/user.php');

$out = new stdClass();

$user = new User();
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

if(!$user->isAdmin()) {
    $out->error = 'Please login';
}
else {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $out = json_decode(file_get_contents('settings.json'));
    }
    else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (file_exists('settings.json')){
            if (!copy('settings.json', 'settingsold.json')) {
                error_log("\n\r".date("m.d.y H:m:s - ")."Error: No copy settings.json", 3, 'error.log');
            }
        }
        $data = json_decode(file_get_contents('php://input'));
        $out->result = file_put_contents('settings.json', json_encode($data));
        if ($out->result == 0){
            error_log("\n\r".date("m.d.y H:m:s - ")."Error: No out->result", 3, 'error.log');
        }
        else {
            $out->success = 'success';
        }
    }
}
echo json_encode($out);
?>