<?php
require('service/user.php');
$user = new User();
if($user->isAdmin()){

}else{
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
    <link href='https://fonts.googleapis.com/css?family=Headland+One' rel='stylesheet' type='text/css'>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js"></script>
    <script src="libs/moment.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css" rel="stylesheet">

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
                        <a id="btn-plus" class="btn">
                            <span class="fa fa-file"></span>
                            <span>Import</span>
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

                <div>
                    <a id="btnPreview" class="btn" href="index.php">
                        <span class="fa fa-eye"></span>
                        <span>Preview</span>
                    </a>
                </div>

                <div class="pull-right" >
                    <a id="btn-logout" class="btn">
                        <span class="fa fa-sign-out"></span>
                        <span>Logout</span>
                    </a>
                    <script>
                        $('#btn-logout').click(function(){
                            $.get('service/login.php',{a:'logout'}).done(function(res){
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
                        <tr>
                            <th>Date</th><th>Start</th><th>End</th><th>Event</th><th>Location</th>
                        </tr>
                        <script id="row-template" type="text/template">
                            <td class="date">
                                <span><%=date%></span>
                            </td>
                            <td class="start">
                                <span><%=start%></span>
                            </td>
                            <td class="end">
                                <span><%=end%></span>
                            </td>
                            <td class="myevent">
                                <span><%=myevent%></span>
                            </td>
                            <td class="location">
                                <span><%=location%></span>
                            </td>
                        </script>
                        <tbody id="tablebody">

                        </tbody>
                    </table>
            </div>

    </div>



<!--    <script src="libs/xls.min.js" ></script>-->
    <script src="crawl/AdminBackbone.js" ></script>
    <script src="crawl/Admin.js" ></script>
<!--    <script>-->
<!--        $(document).ready(function(){-->
<!--            var options = {-->
<!--                url_upload_temp:'service/upload-temp.php',-->
<!--                url_get_excel:'service/get-excel.php',-->
<!--                url_save_data:'service/save-data.php'-->
<!--//                url_ret:'service/excel-to-json.php'-->
<!--            }-->
<!--            var app = new myapp.Main(options);-->
<!--        })-->
<!---->
<!--    </script>-->

</div>
</body>
</html>