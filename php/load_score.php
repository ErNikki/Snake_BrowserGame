<?php
    header("Access-Control-Allow-Origin: *");
    if( isset($_POST['name']) && isset($_POST['score']) ){


        
        
        $conn = mysqli_connect("127.0.0.1", "root", "", "snake");

        $name=$_POST['name'];
        $score=$_POST['score'];   

        $name=$conn->escape_string($name);
        $score=$conn->escape_string($score);

        $q="INSERT INTO hall_of_fame (name,score) VALUES ('$name',$score)";
        $conn->query($q);
        
    }
?>