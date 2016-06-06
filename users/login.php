<?php
    ini_set('html_errors', false);
    require('user.php');
    $out = new stdClass();
    $user = new User();
    $input = new stdClass();
    $method = $_SERVER['REQUEST_METHOD'];
    if($method == 'POST'){
        $input->user = $_POST['username'];
        $input->pass = $_POST['password'];
        $res = $user->login($input);
        if($res) $out->success = 'success';
        else {
            $out->result = 'wrong username or password';
        }
    }else{
        $user->logOut();
        $out->result= $user->isAdmin();
        $out->role = $user->getRole();
    }
    header('Content-type: application/json');
    echo json_encode($out);
?>