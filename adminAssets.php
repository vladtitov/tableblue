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
<div id="Header">
 <img width="100%" src = "css/header.jpg">
</div>
<div class="container">
    <div class="col-md-12">
        <a href="admin.php" class="btn"><span class="fa fa-commenting""></span>  Messages Marquee</a>
        <a href="Rating.php" class="btn"><span class="fa fa-calculator""></span>  Raitng</a>
        <div class="pull-right" >
            <a id="btn-logout" class="btn">
                <span class="fa fa-sign-out"></span>
                <span>Logout</span>
            </a>
            <script>
                $('#btn-logout').click(function(){
                    $.get('users/login.php',{a:'logout'}).done(function(res){
                        console.log(res)
                        window.location.reload();
                    }).fail(function(res){
                        window.location.reload();
                    })
                })
            </script>
        </div>
    </div>
</div>
<br/>

<div id="TableIcons" class="container">
    <div class="row">
        <div class="panel panel-default">
            <div class="panel-heading tools">
                <style>
                    #TableIcons .tools>div, #TableIcons .tools input{
                        display: inline;
                    }
                    #TableIcons .panel-body{
                        height: 600px;
                        overflow: auto;
                    }
                    #TableIcons tr.selected {
                        background-color: khaki;
                    }
                    #TableIcons .myicon div{
                        height: 100px;
                        width: 100px;
                        background-size: 100% 100%;
                    }
                    #TableIcons td{
                        vertical-align: middle;
                    }
                </style>
                <div>
                    <span class="fa fa-picture-o"></span>
                    <span>Icons Manager</span>
                    <small> (Note: Choosing new file replacing old one without backup copy )</small>
                </div>


            </div>

            <div class="panel-body">
                <table id="tableone" class="table table-condensed table-striped">
                    <script id="row-template" type="text/template">
                        <td class="myicon">
                            <div style="background-image: url('<%=icon%>');"></div>
                        </td>
                        <td>
                            <span><%=name%></span>
                        </td>
                        <td class="myinput">
                            <input type="file" class="btn"/>
                        </td>
                    </script>
                    <thead>
                    <tr>
                        <th>
                            Icons
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Change
                        </th>
                    </tr>
                    </thead>
                    <tbody id="tablebody">

                    </tbody>
                </table>
            </div>
        </div>

        <script src="assets/main.js"></script>

    </div>
</div>
 <div id="Footer">
     <img width="100%" src = "css/footer.jpg">
    </div>
</body>
</html>