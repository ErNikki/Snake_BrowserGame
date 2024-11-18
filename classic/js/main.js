const HEIGHT=40;
const WIDTH=40;
const BLOCK=Math.floor((document.documentElement.clientHeight-20)/HEIGHT);
const snakeStartX=Math.floor(Math.random()*10)*BLOCK;
const snakeStartY=Math.floor(Math.random()*10)*BLOCK;

const BACKGROUND_COLOR="#000000";
const BACKGROUND_BORDER_COLORE="#000000";
const SNAKE_BODY_COLOR="#01ffdd";
const SNAKE_HEAD_COLOR="#01ffdd";
const FOOD_COLOR="#FB2B11";
const INIT_SNAKE_LENGHT = 10;

let DIRECTIONS={
    UP: 1,
    DOWN:2,
    RIGHT:3,
    LEFT:4
}

let currDirection=DIRECTIONS.DOWN;

let score=0;
let lastScore=0;

//handler che gestisce la direzione in base al tasto premuto
function direction(event){

    key=event.keyCode;


    if(key==87 && currDirection!=DIRECTIONS.DOWN){
        //119==W
        currDirection=DIRECTIONS.UP;
    }

    else if(key==83 && currDirection!=DIRECTIONS.UP){
        //115==S
        currDirection=DIRECTIONS.DOWN;
    }

    else if(key==68 && currDirection!=DIRECTIONS.LEFT){
        //100==D
        currDirection=DIRECTIONS.RIGHT;
    }

    else if(key==65 && currDirection!=DIRECTIONS.RIGHT){
        //97==A
        currDirection=DIRECTIONS.LEFT;
    }
};

let cvs;
let ctx;

let snake=[];
let food;
var mainInterval;

//inizializza le variabili e setta il refresh dell'immagine
function init(){
    snake=[];
    food=null;
    score=0;

    document.getElementById("ground").setAttribute("height",BLOCK*HEIGHT);
    document.getElementById("ground").setAttribute("width",BLOCK*WIDTH);

    document.addEventListener("keydown", direction);
    cvs=document.getElementById("ground");
    ctx=cvs.getContext("2d"); //context

    for(i=0;i<INIT_SNAKE_LENGHT;i++){
        xx=snakeStartX+BLOCK*i;
        yy=snakeStartY+BLOCK;
        snake[i]={
            y:yy,
            x:xx
        };

    }
    initAJAX();
    generateFood();
    window.setInterval(draw,100);

};


//disegna il terreno
//due varianti
function drawGround(){
    ctx.fillStyle=BACKGROUND_COLOR;
    ctx.fillRect(0,0,WIDTH*BLOCK,HEIGHT*BLOCK);
};

//disegna il serpente con la logica dei canvas
function drawSnake(){ 

    for(i=0;i<snake.length;i++){

        //devo associare all'oggetto snake[i] anche l'immagine da mettere
        // e lo faccio nel controllo degli eventi i o meglio quando creo la nuova testa
        // e faccio il pop
        ctx.fillStyle=(i==0)? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
        if(snake)
        ctx.fillRect(snake[i].x,snake[i].y,BLOCK,BLOCK);
    }
};


//controlla se il cibo sta sul serpente 
//viene chiamata nella funzione di generazione del cibo
function foodOverSnake(){
    for(i=0;i<snake.length;i++){
        if(snake[i].x==food.x && snake[i].y==food.y){
            return true;
        }
    }
    return false;
};

//controlla se il serpente ha mangiato il cibo
function foodOverSnakeHead(){
    if(snake[0].x==food.x && snake[0].y==food.y){
        return true;
    }
    else return false;
};

//genera la variabile food controllando che il cibo non sia stato creato
//sul serpente
function generateFood(){
    do{
        food={
            x: Math.floor(Math.random()*WIDTH)*BLOCK,
            y: Math.floor(Math.random()*HEIGHT)*BLOCK
        };
    }while(foodOverSnake());
}

//disegna il cibo
function drawFood(){
    ctx.fillStyle=FOOD_COLOR;
    ctx.fillRect(food.x,food.y,BLOCK,BLOCK);
};

//verifica che il serpente passato non si sia autodivorato
function snakeEatsItself(){

    let snakeHead=snake[0];
    for(i=1;i<snake.length;i++){
        if(snakeHead.x==snake[i].x && snakeHead.y==snake[i].y){
            return true;
        }
    }

    return false;

};

//viene chiamata quando il serpente si mangia
//gestisce la finestra finale nella quale viene salvato lo score
function gameOver(){
    clearInterval(mainInterval);

    $("#finalScore").html(score);
    if(score>lastScore){//lastScore si trova in UIUpdate
        $("#closeDialog").hide();
    }
    else {
        $("#sendScore").hide();
    }

    $("#dialog").dialog({
        closeText:"x",
        close: function( event, ui ) {
            location.reload();
        }
    });
};

function draw(){

    if(snakeEatsItself()){
        gameOver();
    }
    else{
        drawGround();
        drawFood();
        drawSnake();

        var newHead={
            x:0,
            y:0
        };


        if(currDirection==DIRECTIONS.UP){

            newHead.x=snake[0].x;
            newHead.y=snake[0].y-BLOCK;
            //pacman effect
            //snake deve essere disegnato ad y=980
            if(newHead.y<0){
                newHead.y=(HEIGHT-1)*BLOCK;
            }
        }
        else if(currDirection==DIRECTIONS.DOWN){
            newHead.x=snake[0].x;
            newHead.y=snake[0].y+BLOCK;
            //pacman effect
            //se supera 980 deve tornare ad x=0 dopo 980
            //disegna il quadrato su x=1000
            if(newHead.y>(HEIGHT-1)*BLOCK){
                newHead.y=0;
            }

        }
        else if(currDirection==DIRECTIONS.LEFT){
            newHead.x=snake[0].x-BLOCK;
            newHead.y=snake[0].y;
            //pacman effect
            //snake deve essere disegnato ad x=980

            if(newHead.x<0){
                newHead.x=(WIDTH-1)*BLOCK;
            }

        }
        else if(currDirection==DIRECTIONS.RIGHT){
            newHead.x=snake[0].x+BLOCK;
            newHead.y=snake[0].y;
            //pacman effect
            //se supera 980 deve tornare ad x=0 dopo 980
            //disegna il quadrato su x=1000
            if(newHead.x> (WIDTH-1)*BLOCK){
                newHead.x=0;
            }

        }

        snake.unshift(newHead);

        if(foodOverSnakeHead()){
            score++;
            $("#score").html("SCORE: "+score);
            generateFood();
            drawFood();
        }
        else{
            groundBlock=snake.pop();
        }




    }

};

function sendScore(){
    name = $("#nameForScore").val();
    if(name.length==0){
        alert("You must insert a nickname!");
        return;
    }
    //Chiamata AJAX
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //4 significa risultato caricato
            //200 significa che non ci sono errori nel protocollo http

            msg=this.responseText;
            console.log(msg);
            //msg messaggio di risposta con il server

            if(this.response==0){
                $('#dialog').dialog('close');
                location.reload();
            }
        }
    };
    xhttp.open("POST", "http://"+SERVER_ADDRES+":8080/data/snake/php/load_score.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("name="+name+"&score="+score);
    //Invio una richiesta POST passandogli name e score
}




function initAJAX(){
    getData();
    window.setInterval(getData,5000);
}

function getData(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            msg=JSON.parse(this.responseText);
            data="";
            msg.forEach(e => {
                data+="<li>"+e['name']+" - "+e['score']+"</li>\n";
                lastScore=e['score'];
            });
            $('ul.hallOfFame').html(data);
        }
    };
    xhttp.open("GET", "http://"+SERVER_ADDRES+":8080/data/snake/php/get_score.php", true);
    xhttp.send();
}

function closeIt(){
    //Chiude il dialog che appare
    $("#dialog").dialog("close");//close();
}