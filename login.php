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
    <script src="libs/underscore-min.js"></script>
    <script src="libs/backbone-min.js"></script>
    <script src="libs/moment.js"></script>
    <link rel="stylesheet" href="libs/font-awesome.css">
    
    <style>
        #UserForm{
            width: 350px;
            height: 280px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
        #Message{
            position: absolute;
            bottom: 20px;
            padding: 5px;
            background-color: #faebcc;
            border-radius: 5px;
            box-shadow: 5px 5px 5px gray;
            font-size: small;
        }
    </style>
</head>
<body>
    <div class="container">
        <div>
            <div id="UserForm" class="row">
                <div id="LoginForm"  class="panel panel-default">
                    <a style="font-size: x-small"  title="Forget username or password" class="btn pull-right" data-id="forget" href="#RestoreUser">Forget username/password</a>
                    <div class="panel-body">
                        <div style="position: relative">
                            <div id="Message" style="display: none"  data-id="message">

                            </div>
                        </div>
                        <form  class="form">
                            <div class="form-group">
                                <label for="user">Username</label>
                                <input type="text" class="form-control" name="username" id="user">
                            </div>
                            <div class="form-group">
                                <label for="pwd">Password:</label>
                                <input type="password" class="form-control" name="password" id="pwd">
                            </div>
                            <div class="checkbox">
                                <label><input type="checkbox" data-id="chkPass" name="showpassword"> Show password</label>
                            </div>
                            <hr/>
                            <button type="submit" class="btn btn-primary pull-right">Submit</button>
                        </form>
                    </div>
                </div>

                <div id="RestoreForm" style="display: none">
                    <div class="panel panel-default">
                        <button type="button" class="close"  data-id="closeRestore">&times;</button>
                        <div class="panel-body">
                            <div>
                                <h5>Restore username</h5>
                                <div style="position: relative">
                                   <!-- <div class="off message" data-id="message">
                                    </div>-->
                                </div>
                                <form>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" class="form-control" name="email" id="email" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary pull-right">Email me my username</button>
                                </form>
                            </div>
                            <br/>
                            <hr>
                            <div>
                                <h5>Restore password</h5>
                                <div style="position: relative">
                                   <!-- <div id="Message" class="off message" data-id="message">
    
                                    </div>-->
                                </div>
                                <form>
                                    <div class="form-group">
                                        <label for="username">Username</label>
                                        <input type="text" class="form-control" name="username" id="username" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary pull-right">Email me my password</button>
                                </form>
                            </div>
                        </div>
                        <button class="btn btn-default close" >Close</button>
                        <br/>
                    </div>
                </div>

            <script>
                $(document).ready(function(){
                    var initLogin = function(){
                        var submit = $('#LoginForm [type=submit]');
                        var form = $( '#LoginForm form' ).submit(function( evt){
                            evt.preventDefault();
                            onSubmit();
                        });
                        form.find('input').focus(function(){
                            $('#Message').hide('slow');
                        });
                        var onSubmit = function(){
                            var valid = true;
                            submit.attr('disabled',true);
                            var obj ={};
                            form.find('input').each(function(i,input){
                                obj[input.name]=input.value;
                            });

                            $.post('users/login.php',obj).done(function(res){
                                console.log(res);
                                if(res.success=='success')    window.location.reload();
                                else {
                                    $('#Message').html(res.result).show('fast');
                                }
                                submit.attr('disabled',false);

                            }).fail(function(err){
                                console.log(err);
                                submit.attr('disabled',false);

                            })
                        };

                        $('#LoginForm [name=showpassword]').change(function (evt) {
                            var ch =  $(evt.currentTarget).prop('checked');
                            var pwd = $('#LoginForm [name=password]');
                            if(ch)pwd.attr('type','text');
                            else pwd.attr('type','password');
                        })
                    }

                    initLogin();
                    
                    var initRestore = function(){

                        $('#RestoreForm .close').click(function(){
                            $('#LoginForm').show('fast');
                            $('#RestoreForm').hide('fast');
                        })

                        $('#UserForm [data-id=forget]').click(function(){
                            $('#LoginForm').hide('fast');
                            $('#RestoreForm').show('fast');

                        })
                    }

                    initRestore();
                })
            </script>
            </div>
        </div>
    </div>
</body>
</html>