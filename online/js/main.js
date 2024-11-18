const HEIGHT=40;
const WIDTH=40;
const BLOCK=Math.floor((document.documentElement.clientHeight-20)/HEIGHT);
const snakeStartX=Math.floor(Math.random()*10)*BLOCK;
const snakeStartY=Math.floor(Math.random()*10)*BLOCK;

const BACKGROUND_COLOR="#000000";
const BACKGROUND_BORDER_COLORE="#000000";
const SNAKE_BODY_COLOR="#00ff16";
const SNAKE_HEAD_COLOR="#00ff16";

const SNAKE_ENEMY_BODY_COLOR="#7700ff";
const SNAKE_ENEMY_HEAD_COLOR="#7700ff";

const FOOD_COLOR="#c90000";
const INIT_SNAKE_LENGHT = 10;
const TIMER=15;

const NEED_FOOD="1";
const NOT_NEED_FOOD="0";
let foodStatus;
/*
    Sarà uguale a:
        NEED_FOOD se l'istanza del gioco necessita altro cibo
        NOT_NEED_FOOD se non necessita altro cibo
*/

const SERVER='S'
const CLIENT='C'
let ComunicationRole;
/* Sarà uguale a:
    SERVER se l'istanza del gioco fungerà da server
    CLIENT se l'istanza del gioco fungerà di client
*/

const CLIENT_LEFT='L';
const NEW_CONNECTION='N'
const CLOSE_CONNECTION='K'
const YOU_WIN='1';
//Messagi di scampio con il protocollo tra l'istanza del browser e il server python

let DIRECTIONS={
    UP: 1,
    DOWN:2,
    RIGHT:3,
    LEFT:4
}

let currDirection=DIRECTIONS.DOWN;

let score=0;
let enemyScore=0;

let ws=null;

let cvs;
let ctx;

let snake=[];
let enemy_snake=[];
let food=null;

let mainInterval;

let timeLeft;
let timerInterval;

let gameEnd=false;

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

function init(){
    clearInterval(mainInterval);
    snake=[];
    food=null;
    score=0;
    foodStatus=NOT_NEED_FOOD;

    initWS();//Crea la connessione con il server python

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
    
    timeLeft=TIMER;
    $("#timer").html(timeLeft+"s");

    generateFood();

    mainInterval=window.setInterval(draw,100);  
};

function drawGround(){
    ctx.fillStyle=BACKGROUND_COLOR;
    ctx.fillRect(0,0,WIDTH*BLOCK,HEIGHT*BLOCK) 
};

function drawSnake(Snake,ColorHead,ColorBody){ 

    for(i=0;i<Snake.length;i++){

        //devo associare all'oggetto snake[i] anche l'immagine da mettere
        // e lo faccio nel controllo degli eventi i o meglio quando creo la nuova testa
        // e faccio il pop
        
        ctx.fillStyle=(i==0)? ColorHead : ColorBody;
        if(Snake)
        ctx.fillRect(Snake[i].x,Snake[i].y,BLOCK,BLOCK);
    }
};

function foodOverSnake(){ 
    
    for(i=0;i<snake.length;i++){
        
        if(snake[i].x==food.x*BLOCK && snake[i].y==food.y*BLOCK){
            return true;
        }
    }
    return false;


};

function foodOverSnakeHead(){ //function foodOverSnake(Snake,food)
    if(food==null)return false;
    if(snake[0].x==food.x*BLOCK && snake[0].y==food.y*BLOCK){
        return true;
    }
    else return false;
};

function generateFood(){
    if(ComunicationRole==SERVER){
        //Se sono il server, genero il cibo realmente
        food={
            x: Math.floor(Math.random()*WIDTH),
            y: Math.floor(Math.random()*HEIGHT)
        };
    }
    else {
        //Se sono il client setto il flag foodStatus a NEED_FOOD
        food=null;
        foodStatus=NEED_FOOD;
    }
}

function drawFood(myFood){
     
    if(food!=null){
        ctx.fillStyle=FOOD_COLOR;
        ctx.fillRect(myFood.x*BLOCK,myFood.y*BLOCK,BLOCK,BLOCK);
    }    
};

function snakeEatsItself(){

    let snakeHead=snake[0];
    for(i=1;i<snake.length;i++){
        if(snakeHead.x==snake[i].x && snakeHead.y==snake[i].y){
            return true;
        }
    }
    return false;
};

function gameOver(){
    clearInterval(mainInterval); 
    gameEnd=true;
    msg="";
    if(score>enemyScore)msg+="YOU WIN! <br>";
    else if (score<enemyScore)msg+="YOU LOST!<br>";
    else msg+=score.toString()+"-"+enemyScore.toString()+" tie";
    
    $("#dialogMsg").html(msg);        
    $("#dialog").dialog({
        closeText:"x",
        close: function( event, ui ) {
            location.reload();
        }
    });  
          
}



function draw(){

    if(snakeEatsItself()){
        gameOver();
    }
    else{
        drawGround();
        drawFood(food);
        drawSnake(snake,SNAKE_HEAD_COLOR,SNAKE_BODY_COLOR);
        drawSnake(enemy_snake,SNAKE_ENEMY_HEAD_COLOR,SNAKE_ENEMY_BODY_COLOR);

        sendData(snake,score,foodStatus,ws);
    
        var newHead={
           x:0,
           y:0
        }       
    
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
            $("#score").html("Score: "+score);
            generateFood();
            if(ComunicationRole==CLIENT)sendData(snake,score,foodStatus,ws);
        }
        else{
            groundBlock=snake.pop();
        }

    }

};

function initWS() {
    // Connetto al websocket
    ws = new WebSocket(SERVER_SOCKET);
    ws.onopen = function() {
        //Quando la connessione di apre, avvisa il server 
        //che vuole giocare
        ws.send(NEW_CONNECTION);
    };
    ws.onmessage = function(e) {
        /*
        I messaggi scambiati tra le 2 instanze del gioco hanno il seguente
        formato,
        
        | serpente | score | ROLE | foodPosition | needFood |
        
        -serpente: contiene il serpente locale (Snake)
        -score: contiene il punteggio attuale
        -Role: contiene:
            SERVER se l'istanza del gioco fà da server
            CLIENT se l'istanza del gioco fà da client
        -foodPosition:
            Se Role=Server contiene la posizione del cibo
            Se Role=Client contiene (-1,-1) che però verrà ignorato dal ricevente
        - needFood:
            Se Role=Client contiene:
                -NEED_FOOD (1) Se necessità di altro cibo perchè quello corrente è stato mangiato
                -NOT_NEED_FOOD (0) Se non necessità di altro cibo

        Il server non modifica il pacchetto ricevuto, accoppia in vari avversari e poi 
        inoltra il pacchetto ricevuto all' utente giusto
        */
      
        var msg = e.data;

        if(msg==CLIENT_LEFT){
            // Il nemico ha abbandonato il gioco
            // Il server invia un messaggio CLIENT_LEFT 
            data="<p> style='color:#c90000;'You win!<br></p>";
            data+="Your enemy has retired!";
            data+="<button onclick='CloseIt()'>Ok</button>";
            $("#dialogMsg").html(data)
            $(function(){
                $("#dialog").dialog({
                    closeText:"x",
                    close: function( event, ui ) {
                        location.reload();
                    }
                });
              });  
        }

        else if(msg==YOU_WIN){
            //Il nemico si è sucidato
            //Il server invia il messaggio YOU_WIN
            $("#dialogMsg").html("YOU WIN!");
            $("#dialog").dialog({
                closeText:"x",
                close: function( event, ui ) {
                    location.reload();
                }
            });
            
        }

        if(msg==SERVER || msg==CLIENT){
            //IL SERVER HA TROVATO UN AVVERSARIO
            //ASSEGNA I RUOLI ALLE VARIE PAGINE

            ComunicationRole=msg;

            console.log("I'm :"+ComunicationRole);
            $("#txtbox").html("Player found");
            $(".hallOfFame").removeClass("blink_me");
            $("#txtbox").fadeOut(5000);

            timerInterval = setInterval(function(){
                timeLeft--;
                document.getElementById("timer").innerHTML =timeLeft+"s";
                if(timeLeft == 0){
                    clearInterval(timerInterval);
                    gameOver();
                }
                },1000);
        }
        else {

            msg=JSON.parse(msg);
            //Parso il messaggio e mi ricavo i vari campo come nel frame descritto prima
            //        | serpente | score | ROLE | foodPosition | needFood |

            needFood = msg.pop();
            foodPosition = msg.pop();
            role=msg.pop();

            if (ComunicationRole==SERVER && needFood==NEED_FOOD ){
                //Se il server mi dice di generare altro food
                generateFood();
            }
            
            if (ComunicationRole==CLIENT && foodPosition!=null ){
                food={
                    x:foodPosition.x,
                    y:foodPosition.y
                };
                foodStatus=NOT_NEED_FOOD;     
            }

            enemyScore=msg.pop();
            $("#enemyScore").html("Enemy score: "+enemyScore)

            enemy_snake=msg; //Non faccio pop perchè è rimasto solo il campo serpente            
        }              
    };

    ws.onclose = function() {//Se la connessione con il server è chiusa
        if(ComunicationRole!=null && !gameEnd){//Controllo per non  farlo stampare se il server è giù

            data="<p style='color:#c90000;'>You win!</p><br>";
            data+="Your enemy has retired!";
            $("#dialogMsg").html(data)

            $("#dialog").dialog({
                closeText:"x",
                close: function( event, ui ) {
                        location.reload();
                }
            }); 
        }
    };
    ws.onerror = function(e) { //Se c'è un errore nella comunicazione con il server
      $("#txtbox").html("Error:<br>Server not found");
    };
}

function CloseIt(){
    //Chiude il dialog che appare
    $("#dialog").dialog("close");//close();
}

function sendData(mySnake,myScore,myFoodStatus,WS){ //Invia i dati al server
    
    //Usa lo stesso formato usato per la ricezione
    //| serpente | score | ROLE | foodPosition | needFood |

    if(WS==null)return;
    
    myS=mySnake.slice();//Crea una copia di mySnake
                        //Mi serve un capia perchè con push
                        //aggiungerò altri elementi in coda
                        //all'array
    myS.push(myScore);
    myS.push(ComunicationRole);

    if(ComunicationRole==CLIENT){ //Se sono il CLIENT
        myS.push((-1,-1))        //Inserisco un data casuale per riempire il campo, infatti il dato non verrà utilizzato
        myS.push(myFoodStatus);  //Contiene lo stato del cibo, se sarà uguale NEED_FOOD il server genereà altro cibo, altriemnti no
    }
    else { //Se sono il Server
        if(food==null)generateFood();
        myS.push(food);     //Inserisco la posizione del cibo
        myS.push(0);        //Inserisco 0 in NeedFood perchè sono il server e ho generato io il cibo
                            //perciò non mi server altro    
        }
                            
    WS.send(JSON.stringify(myS)); //Converto l'array in una stringa JSON e la invio
}