<!doctype html>
<html>

<head>
    <meta charset="UTF-8" >
    <title>Snake 2.0</title>
    <script>
        <?php
        echo 'const SERVER_SOCKET="ws://'.getHostByName(getHostName()).':9001"';
        ?>
    </script>
    <script src="lib/jquery-3.3.1.min.js"></script>
    <script src="lib/jquery-ui.js"></script>
    <script src="js/main.js"></script>    
    <link rel="stylesheet" href="style.css">
</head>

<body onload="init();">
    

    <div id="dialog" hidden>
        <p style="color:#c90000;">GAME OVER!</p>
        <p id=dialogMsg></p>
        <br><br>
        <button onclick="CloseIt()">Ok</button>
    </div>

    <aside style="float: left;">
        <p id="Title">SNAKE 2.0</p>     
        <p id="score" class="score">Score: 0</p>
        <p id="enemyScore" class="score">Enemy Score: 0</p>
        <p id="timer"></p>
        <br><br>
        <div class="hallOfFame blink_me">
            <p id="txtbox">I'm looking for players</p>
        </div>
    </aside>
    <div id="gameArea">
        <canvas id="ground"></canvas> 
    </div>
</body>
</html>