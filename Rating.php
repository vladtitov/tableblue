<?php
require('users/user.php');
$user = new User();

if($user->isAdmin()){

}
else{
    include('login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="libs/jquery-2.1.4.min.js"></script>
    <link href="libs/bootstrap.min.css" rel="stylesheet">
    <script src="libs/bootstrap.min.js"></script>
    <link href="libs/font-awesome.min.css" rel="stylesheet">
    <script src="libs/underscore-min.js"></script>
    <script src="libs/backbone-min.js"></script>
    <script src="libs/moment.js"></script>
</head>
<body>


</body>
</html>