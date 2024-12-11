<?php 
define('PATHABS',__DIR__); //Define the absolute path of this file
session_start();
//custom page according GET here
if(isset($_GET['absen'])):
    //load Presence Page
    require 'block/special/absensi_acara.php';
    require 'block/tooltip.php';
elseif(isset($_GET['page'])):
    //load  custom page from pages folder
    
elseif(isset($_GET['article'])):
    //load articles  from database

elseif(isset($_GET["pleaseHandle"])):
    //Handle Incoming POST $_POST["Type"] will show what action to do 
    require 'block/handlePOST/handler.php';

elseif(isset($_GET["point"])):
   require 'block/point.php';
elseif(isset($_GET['terminal'])):
    //load admin-login page

    //this is where admin can write articles and some dynamical content
else:
    // default main Page here
require 'mainpage.php';

endif; ?>