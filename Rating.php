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
<br/>
<div class="container">
    <div class="col-md-12">
        <a href="adminAssets.php" class="btn"><span class="fa fa-picture-o"></span> Icons Manager</a>
        <a href="admin.php" class="btn"><span class="fa fa-commenting""></span>  Messages Marquee</a>
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


<div id="Table1" class="container">
    <div id="AdminBackbone" class="row">
        <div class="panel panel-default">
            <div class="panel-heading tools">
                <style>
                    #Table1 .tools>div, #Table1 .tools input{
                        display: inline;
                    }
                    #Table1 #tableone{
                        height: 300px;
                        overflow: auto;
                    }
                    #Table1 tr.selected {
                        background-color: khaki;
                    }
                    #Table1 th{
                        text-align: center;
                    }
                </style>
                <div>
                    <span class="fa fa-calculator"></span>
                    Rating calculator
                </div>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <div>
                    <span class="fa fa-calendar-check-o"></span>
                    <input type="radio" name="WeeklyDayly" value="d" checked > Daily
                    <input type="radio" name="WeeklyDayly" value="w"> Weekly

                </div>

                <div class="pull-right" >
                    <a id="btnSave" class="btn">
                        <span class="fa fa-save"></span>
                        <span>Save</span>
                    </a>
                </div>
            </div>

            <div class="panel-body">

                <div id="Calculator">
                    <style>

                        #IconsList>div{
                            display: inline-block;
                            margin: 10px;
                            /*text-align: center;*/
                        }
                        #IconsList img{
                            width: 50px;
                            height: 50px;
                            padding: 5px;
                        }
                    </style>
                    <div class="panel panel-default">

                        <div id="IconsList">

                        </div>
                    </div>
                </div>
                <div id="tableone" >


                     <table class="table table-condensed table-striped text-center">
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
                           Icon
                        </th>
                        <th >
                            % of <input id="PercentOf" type="text" size="2" />
                        </th>
                        <th class="text-center">
                            <div>Total / <span>Time</span></div>
                            <span></span>
                        </th>
                        <th >
                            Time
                            <div><span class="small">redy_eff / <span id="Devider"></span> </span> </div>
                           <!-- <form>
                                <input type="radio" name="timeGroup" value="3600"  checked>H
                                <input type="radio" name="timeGroup" value="60">M
                                <input type="radio" name="timeGroup" value="1">S
                            </form>-->
                        </th>
                        <th>
                            Total
                        </th>
                        <th>
                            Dial
                        </th>
                        <th>
                            Prescriber
                        </th>
                        <th>
                            Non-prescriber
                        </th>

                    </tr>
                    </thead>
                    <tbody id="tablebody">

                    </tbody>
                </table>
                </div>

                <script type="application/template" id="DataRow">
                    <td><img width="30" height="30" src="<%=icon%>" /></td>
                    <td><%=rating%></td>
                    <td><%=calculated%></td>
                    <td class="text-center"><%=time%></td>
                    <td><%=total%></td>
                    <td><%=Dial%></td>
                    <td><%=Prescriber%></td>
                    <td><%= Non_prescriber%></td>

                </script>
            </div>



        </div>
        <script src="rating/main.js"></script>

    </div>
</div>
</body>
</html>