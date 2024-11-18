const HEIGHT=40;
const WIDTH=40;
const BLOCK=Math.floor((document.documentElement.clientHeight-20)/HEIGHT);
const snakeStartX=WIDTH/2*BLOCK;
const snakeStartY=HEIGHT/2*BLOCK;

const BACKGROUND_COLOR="#000000";
const BACKGROUND_BORDER_COLORE="#000000";
const SNAKE_BODY_COLOR="#00ff16";
const SNAKE_HEAD_COLOR="#00ff16";
//const SNAKEIA_BODY_COLOR="#ff3399"
//const SNAKEIA_HEAD_COLOR="#ff3399"
const SNAKEIA_BODY_COLOR="#00ffff";
const SNAKEIA_HEAD_COLOR="#00ffff";

const FOOD_COLOR="#FB2B11";
const INIT_SNAKE_LENGHT = 10;
const TIMER=15;

let DIRECTIONS={
    UP: 0,
    DOWN:1,
    RIGHT:2,
    LEFT:3
}

let currDirection=DIRECTIONS.LEFT;
let currDirectionIA=DIRECTIONS.LEFT;
let prevDirectionIA=DIRECTIONS.LEFT;

//document.addEventListener("keydown", direction);
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
let snakeIA=[];
let food;
let mainInterval;
let timerInterval;
let score=0;
let scoreIA=0;
let timeLeft;

//inizializza le variabili e setta il refresh dell'immagine
//gestisce il timer 
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
    };

    for(i=0;i<INIT_SNAKE_LENGHT;i++){
        xx=snakeStartX+BLOCK*4+BLOCK*i;
        yy=snakeStartY+BLOCK*4+BLOCK;
        snakeIA[i]={
            y:yy,
            x:xx
        };

    };

    generateFood();

    mainInterval=window.setInterval(draw,100);

    timeLeft = TIMER;
    $("#timer").html(timeLeft+"s");
    timerInterval = setInterval(function(){
    timeLeft--;
    $("#timer").html(timeLeft+"s");
    if(timeLeft == 0)
        gameOver();
        return;
    },1000);
  ;

};

//disegna il terreno
//due varianti
function drawGround(){


    ctx.fillStyle=BACKGROUND_COLOR;


    //ctx.strokeStyle="green";
    /*
    nel caso volessi i quadrati con i bordi!!
    for(x=0;x<WIDTH*BLOCK;x+=BLOCK){
        for(y=0;y<HEIGHT*BLOCK;y+=BLOCK){

            ctx.fillRect(x,y,BLOCK,BLOCK);
            ctx.strokeRect(x,y,BLOCK,BLOCK);
        }
    }*/
    ctx.fillRect(0,0,WIDTH*BLOCK,HEIGHT*BLOCK)

};

//disegna il serpente 
function drawSnake(mySnake){ //function drawSnake(Snake)

    for(i=0;i<mySnake.length;i++){

        //devo associare all'oggetto snake[i] anche l'immagine da mettere
        // e lo faccio nel controllo degli eventi i o meglio quando creo la nuova testa
        // e faccio il pop
        ctx.fillStyle=(i==0)? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
        ///if(mySnake)
        ctx.fillRect(mySnake[i].x,mySnake[i].y,BLOCK,BLOCK);
        console.log("x:" +mySnake[i].x+" y: "+mySnake[i].y)
    }
};

//disegna il serpente ia con la logica dei canvas
function drawSnakeIA(mySnake){ //function drawSnake(Snake)

    for(i=0;i<mySnake.length;i++){

        //devo associare all'oggetto snake[i] anche l'immagine da mettere
        // e lo faccio nel controllo degli eventi i o meglio quando creo la nuova testa
        // e faccio il pop
        ctx.fillStyle=(i==0)?SNAKEIA_HEAD_COLOR : SNAKEIA_BODY_COLOR;
        ///if(mySnake)
        ctx.fillRect(mySnake[i].x,mySnake[i].y,BLOCK,BLOCK);
    }
};

//controlla se il cibo sta sul serpente 
//viene chiamata nella funzione di generazione del cibo
function foodOverSnake(mySnake){

    for(i=0;i<mySnake.length;i++){

        if(mySnake[i].x==food.x && mySnake[i].y==food.y){
            return true;
        }
    }
    return false;


};

//controlla se il serpente ha mangiato il cibo
function foodOverSnakeHead(mySnake){ //function foodOverSnake(Snake,food)
    if(mySnake[0].x==food.x && mySnake[0].y==food.y){
        return true;
    }
    else return false;
};

//genera la variabile food controllando che il cibo non sia stato creato
//su uno dei due serpenti
function generateFood(){
    do{

        food={
            x: Math.floor(Math.random()*WIDTH)*BLOCK,
            y: Math.floor(Math.random()*HEIGHT)*BLOCK
        };
    }while(foodOverSnake(snake)|| foodOverSnake(snakeIA));

}

//disegna il cibo
function drawFood(){

    ctx.fillStyle=FOOD_COLOR;
    ctx.fillRect(food.x,food.y,BLOCK,BLOCK);

};

//verifica che il serpente non si sia autodivorato
function snakeEatsItself(mySnake){

    let snakeHead=mySnake[0];
    for(i=1;i<mySnake.length;i++){
        if(snakeHead.x==mySnake[i].x && snakeHead.y==mySnake[i].y){
            console.log("i:"+i+" headx:"+snakeHead.x+" heady:"+snakeHead.y+" ia:"+mySnake[i].x)
            return true;

        }
    }

    return false;

};

//torna true se la nuova testa creata per l'IA
//si trova sullo snake. in tal caso si autodivora!!
function newHeadIAOverIA(myNewHead){

    for(i=0;i<snakeIA.length-1;i++){
        if(snakeIA[i].x==myNewHead.x && snakeIA[i].y==myNewHead.y){
            return true;
        }
    }
    return false;

}

//genera una nuova testa passando come parametri la vecchia testa e la direzione corrente
function generateNewHead(mySnakeHead,myDirection){

    var newHead={
        x:0,
        y:0
    };

    if(myDirection==DIRECTIONS.UP){

        newHead.x=mySnakeHead.x;
        newHead.y=mySnakeHead.y-BLOCK;
        //pacman effect
        //snake deve essere disegnato ad y=980
        if(newHead.y<0){
            newHead.y=(HEIGHT-1)*BLOCK;
        }
    }
    else if(myDirection==DIRECTIONS.DOWN){
        newHead.x=mySnakeHead.x;
        newHead.y=mySnakeHead.y+BLOCK;
        //pacman effect
        //se supera 980 deve tornare ad x=0 dopo 980
        //disegna il quadrato su x=1000
        if(newHead.y>(HEIGHT-1)*BLOCK){
            newHead.y=0;
        }
    }
    else if(myDirection==DIRECTIONS.LEFT){
        newHead.x=mySnakeHead.x-BLOCK;
        newHead.y=mySnakeHead.y;
        //pacman effect
        //snake deve essere disegnato ad x=980

        if(newHead.x<0){
            newHead.x=(WIDTH-1)*BLOCK;
        }
    }
    else if(myDirection==DIRECTIONS.RIGHT){
        newHead.x=mySnakeHead.x+BLOCK;
        newHead.y=mySnakeHead.y;
        //pacman effect
        //se supera 980 deve tornare ad x=0 dopo 980
        //disegna il quadrato su x=1000
        if(newHead.x>(WIDTH-1)*BLOCK){
            newHead.x=0;
        }
    }
    return newHead;

}

//viene chiamata quando il tempo finisce o uno dei due serpenti si mangia
//gestisce la finestra finale nella quale viene salvato lo score
function gameOver(){
    clearInterval(mainInterval);
    clearInterval(timerInterval);
    $("#finalScore").html(score);
    if(scoreIA>score){
        $("#gameOver").html("UNLUCKY TRY AGAIN!");
    }
    else if(scoreIA==score){
        $("#gameOver").html(scoreIA+"-"+score+" tie");
    }
    else {
        $("#gameOver").html("U DID IT BROSKY!!!<br>FUCK IA");
    }
    $("#dialog").dialog({
        closeText:"x",
        close: function( event, ui ) {

            location.reload();
        }
    });
};


//funzione principale chiamata ogni tot secondi
function draw(){

    if(snakeEatsItself(snake) || snakeEatsItself(snakeIA) ){
        gameOver();
    }
    else{
        IA();
        drawGround();
        drawFood();
        drawSnake(snake);
        drawSnakeIA(snakeIA);

        //generazione delle nuova testa
        var newHead=generateNewHead(snake[0],currDirection);


        //generazione della nuova testa per l'ia
        //modificata in modo che non si autodivori
       /* var newHeadIA={
            x:0,
            y:0
         };
         */
        var newHeadIA;
         // creazione delle testa per snakeia in base alla direzione

        if(currDirectionIA==DIRECTIONS.UP){

            newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);
            //questi controlli fanno in modo tale che l'ia non si autodivori!!
            //ovviamente se la direzione è UP quella precedente non può essere DOWN!!
            // o è LEFT o è RIGHT
            if(newHeadIAOverIA(newHeadIA)){

                //caso RIGHT
                // posso prendere due decisioni o mantere la direzione precedenteo andare down
                if( prevDirectionIA==DIRECTIONS.RIGHT){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);
                    }
                }
                //caso LEFT
                //allora la previous direction è per forza left
                else if(prevDirectionIA==DIRECTIONS.LEFT){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);
                    }
                }
                //caso UP
                else{

                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);
                    }

                }

            }
        }
        else if(currDirectionIA==DIRECTIONS.DOWN){

            newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);
            //questi controlli fanno in modo tale che l'ia non si autodivori!!
            //ovviamente se la direzione è DOWN quella precedente non può essere UP!!
            // o è LEFT o è RIGHT o è DOWN
            if(newHeadIAOverIA(newHeadIA)){

                //caso RIGHT
                // posso prendere due decisioni o mantere la direzione precedenteo andare UP
                if( prevDirectionIA==DIRECTIONS.RIGHT){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);
                    }
                }
                //caso LEFT
                //allora la previous direction è per forza left
                else if(prevDirectionIA==DIRECTIONS.LEFT){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);
                    }
                }
                else{

                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);
                    }

                }
            }
        }
        else if(currDirectionIA==DIRECTIONS.LEFT){
            
            newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);
            //questi controlli fanno in modo tale che l'ia non si autodivori!!
            //ovviamente se la direzione è LEFT quella precedente non può essere RIGHT!!
            // o è UP o è DOWN o è LEFT
           
            if(newHeadIAOverIA(newHeadIA)){

                //caso DOWN
                // posso prendere due decisioni o mantere la direzione precedente o andare RIGHT 
                if( prevDirectionIA==DIRECTIONS.DOWN){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);

                    //se non va bene allora mi rimane solo andare RIGHT
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);
                    }
                }
                //caso UP
                //allora la previous direction è per forza UP
                else if(prevDirectionIA==DIRECTIONS.UP){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);

                    //se non va bene allora mi rimane solo andare right
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);
                    }
                }
                //caso LEFT
                else{

                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);
                    }

                }

            }
        }
        else if(currDirectionIA==DIRECTIONS.RIGHT){
            
            newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.RIGHT);
            //questi controlli fanno in modo tale che l'ia non si autodivori!!
            //ovviamente se la direzione è RIGHT quella precedente non può essere LEFT!!
            // o è UP o è DOWN
            if(newHeadIAOverIA(newHeadIA)){

                //caso DOWN
                // posso prendere due decisioni o mantere la direzione precedente o andare LEFT 
                if( prevDirectionIA==DIRECTIONS.DOWN){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);

                    //se non va bene allora mi rimane solo andare LEFT
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);
                    }
                }
                //caso UP
                //allora la previous direction è per forza UP
                else if(prevDirectionIA==DIRECTIONS.UP){
                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);

                    //se non va bene allora mi rimane solo andare LEFT
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.LEFT);
                    }
                }
                //caso RIGHT
                else{

                    newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.UP);

                    //se non va bene allora mi rimane solo andare down
                    if(newHeadIAOverIA(newHeadIA)){
                        newHeadIA=generateNewHead(snakeIA[0],DIRECTIONS.DOWN);
                    }

                }

            }

        }

        snake.unshift(newHead);
        console.log(newHeadIA.x+"   "+newHeadIA.y);
        snakeIA.unshift(newHeadIA);

        //controllo se qualcuno ha mangiato il cibo
        //in caso chi lo mangia non chiama la pop e quindi cresce di un blocco!!
        if(foodOverSnakeHead(snake)){
              score+=1;
              $("#score").html("SCORE: "+score);
              generateFood();
              drawFood();
              groundBlock=snakeIA.pop();
        }
        else if (foodOverSnakeHead(snakeIA)){
            scoreIA+=1;
            $("#scoreIA").html("SCOREIA: "+scoreIA);
            generateFood();
            drawFood();
            groundBlock=snake.pop();

        }
        else {
          groundBlock=snakeIA.pop();
          groundBlock=snake.pop();

        }

  }

};

//decide la prossima direzione dell'ia in base alla posizione del cibo
function IA(){

    foodX=food.x;
    foodY=food.y;

    snakeHeadX=snakeIA[0].x;
    snakeHeadY=snakeIA[0].y;

    prevDirectionIA=currDirectionIA;


    if(snakeHeadX>foodX && prevDirectionIA!=DIRECTIONS.RIGHT){
        currDirectionIA=DIRECTIONS.LEFT;
     }
    else if(snakeHeadX<foodX && prevDirectionIA!=DIRECTIONS.LEFT){
        currDirectionIA=DIRECTIONS.RIGHT;
    }
    else if(snakeHeadY>foodY && prevDirectionIA!=DIRECTIONS.DOWN){
        currDirectionIA=DIRECTIONS.UP;
    }
   //forse è il caso di togliere l'ultimo else if e lasciare solo un else
    else if(snakeHeadY<foodY && prevDirectionIA!=DIRECTIONS.UP){
        currDirectionIA=DIRECTIONS.DOWN;
    }
    //}
};  
