<?php   
    header("Access-Control-Allow-Origin: *");
    $conn = mysqli_connect("127.0.0.1", "root", "", "snake");

    $q="SELECT name,score FROM hall_of_fame ORDER BY score DESC LIMIT 10";
    $ris=$conn->query($q);
    $myArr=[];
    while($arr=$ris->fetch_assoc()){
        array_push($myArr,$arr);
    }
    echo json_encode($myArr);  
?>