<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Snake 2.0</title>
    <script>
        <?php
        echo 'const SERVER_ADDRES="'.getHostByName(getHostName()).'"';
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
        <p>Your score is: <a id="finalScore"></a> </p>
        <div id="sendScore">
            Congratulations!<br>you are on the top ten!
            <br>
            insert your name to are you insert to top ten<br><br>
            <input type='text' id='nameForScore'>
            <br><br>
            <button onClick='sendScore()'>Ok</button>
        </div>
        <div id="closeDialog">
            <button onClick='closeIt();'>Close</button>
        </div>
        <a id="dialogMsg"></a>
    </div>

    <aside style="float: left;">
        <p id="Title">SNAKE 2.0</p>
        <p id="score">SCORE: 0</p>
        <br><br>
      
        <div class="hallOfFame">
            <p>TOP 10:</p>
            <ul class="hallOfFame">
            </ul>
        </div>

    </aside>
    <div id="gameArea">
        <canvas id="ground"></canvas>
    </div>
</body>
</html>
