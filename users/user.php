<?php
    class User{
        function User(){
            session_start();
        }
        public function  isAdmin(){
           return  ($this->getRole() ==='admin');
        }
        public function getRole(){
                return isset($_SESSION['u_user_role'])?$_SESSION['u_user_role']:0;
        }

        public function login($user){
            $user->user = md5($user->user);
            $user->pass = md5($user->pass);
            $users = $this->getUsers();
            if($users){
                foreach($users as $val){
                    if($user->user == $val->username && $user->pass == $val->password) $_SESSION['u_user_role'] = 'admin';
                }
                return $this->isAdmin();
            }
            return 0;
        }
        public function logOut(){
            $_SESSION['u_user_role'] = 0;
            return 1;
        }

        private function db(){
            $root = (string)$_SERVER['DOCUMENT_ROOT'];
            $ind = strpos($root,'public_html');
            if($ind===FALSE) $ind = strpos($root,'www');
            $root = substr($root,0,$ind);
            $users_file = $root.'my_users.json';
            if(!file_exists($users_file)) return 0;
            return json_decode(file_get_contents($users_file));
        }
        private function db2(){
            $users_file = '../data/my_users.json';
            if(!file_exists($users_file)) return 0;
            return json_decode(file_get_contents($users_file));
        }
        private function getUsers(){
            $users = array();
            $u = new stdClass();
            $u->username = "4f5cec75c744bd39b5126debbb7cffb8";
            $u->password = "e3274be5c857fb42ab72d786e281b4b8";
            $users[] = $u;
            return $users;
        }
    }
?>