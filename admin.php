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
    <div id="Table1" class="container">
        <div class="row">
            <div class="panel panel-default">
                <div class="panel-heading tools">
                <style>
                   #Table1 .tools>div, #Table1 .tools input{
                        display: inline;
                    }
                    #Table1 .panel-body{
                        height: 600px;
                        overflow: auto;
                    }
                   #Table1 tr.selected {
                        background-color: khaki;
                    }
                </style>
                    <div>
                        <span class="fa fa-commenting"></span>
                        Messages Marquee
                    </div>
                    <div>
                        <a id="btnAdd" class="btn">
                            <span class="fa fa-plus"></span>
                            <span>Add</span>
                        </a>
                    </div>
                    <div>
                        <a id="btnEdit" class="btn">
                            <span class="fa fa-edit"></span>
                            <span>Edit</span>
                        </a>
                    </div>
                    <div>
                        <a id="btnDelete" class="btn">
                            <span class="fa fa-remove"></span>
                            <span>Delete</span>
                            
                        </a>
                    </div>
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
                    <div class="pull-right" >
                        <a id="btn-save" class="btn">
                            <span class="fa fa-save"></span>
                            <span>Save</span>
                        </a>
                    </div>
                </div>

                <div class="panel-body">
                    <table id="tableone" class="table table-condensed table-striped">
                        <script id="row-template" type="text/template">
                            <td>
                                <input type="checkbox" class="mychecked" <%=active%>/>
                            </td>
                            <td class="myevent">
                                <%=msg%>
                            </td>
                        </script>
                        <thead>
                        <tr>
                            <th>
                                Active
                            </th>
                            <th class="text-center">
                                Content
                            </th>
                        </tr>
                        </thead>
                        <tbody id="tablebody">

                        </tbody>
                    </table>
                </div>
            </div>
            
            <script src="crawl/AdminBackbone.js"></script>
            <script src="crawl/Admin.js"></script>

        </div>
    </div>
</body>
</html>