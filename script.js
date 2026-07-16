const player = document.getElementById("player");
const game = document.getElementById("game");

const pointsText = document.getElementById("points");
const livesText = document.getElementById("lives");

const gameOver = document.getElementById("gameOver");
const restart = document.getElementById("restart");
const finalScore = document.getElementById("finalScore");



let playerX = 200;
let playerY = 200;

let score = 0;
let lives = 3;

let speed = 5;

let running = true;



let joystick = {
    x:0,
    y:0
};



// Spieler anzeigen

function updatePlayer(){

    player.style.left = playerX+"px";
    player.style.top = playerY+"px";

}



// Bewegung

function move(){

    if(!running) return;


    playerX += joystick.x * speed;
    playerY += joystick.y * speed;


    playerX=Math.max(0,Math.min(game.clientWidth-55,playerX));
    playerY=Math.max(0,Math.min(game.clientHeight-55,playerY));


    updatePlayer();


    collision();


    requestAnimationFrame(move);

}



// Joystick

const joy=document.getElementById("joystick");
const stick=document.getElementById("stick");


joy.addEventListener("touchmove",(e)=>{


    let touch=e.touches[0];

    let rect=joy.getBoundingClientRect();


    let x=touch.clientX-(rect.left+75);
    let y=touch.clientY-(rect.top+75);



    let distance=Math.sqrt(x*x+y*y);


    if(distance>50){

        x=x/distance*50;
        y=y/distance*50;

    }


    stick.style.left=(45+x)+"px";
    stick.style.top=(45+y)+"px";


    joystick.x=x/50;
    joystick.y=y/50;



});



joy.addEventListener("touchend",()=>{

    joystick.x=0;
    joystick.y=0;

    stick.style.left="45px";
    stick.style.top="45px";

});





// Müll

function spawnTrash(){

    if(!running)return;


    let trash=document.createElement("div");

    trash.className="trash";

    trash.innerHTML="🍎";


    trash.x=Math.random()*(game.clientWidth-35);
    trash.y=Math.random()*(game.clientHeight-35);


    trash.style.left=trash.x+"px";
    trash.style.top=trash.y+"px";


    game.appendChild(trash);

}



// Katzen

function spawnCat(){

    if(!running)return;


    let cat=document.createElement("div");

    cat.className="cat";

    cat.innerHTML="🐱";


    let x=Math.random()*(game.clientWidth-55);
    let y=Math.random()*(game.clientHeight-55);


    cat.style.left=x+"px";
    cat.style.top=y+"px";


    game.appendChild(cat);



    let ai=setInterval(()=>{


        if(!running){

            clearInterval(ai);
            return;

        }



        let dx=playerX-x;
        let dy=playerY-y;


        let dist=Math.sqrt(dx*dx+dy*dy);


        if(dist>0){

            x += dx/dist*1.8;
            y += dy/dist*1.8;

        }


        cat.style.left=x+"px";
        cat.style.top=y+"px";



    },30);



}





// Kollision

function collision(){

    let p=player.getBoundingClientRect();



    document.querySelectorAll(".trash").forEach(t=>{


        let r=t.getBoundingClientRect();


        if(hit(p,r)){


            score++;

            pointsText.innerText=score;

            t.remove();


        }


    });




    document.querySelectorAll(".cat").forEach(c=>{


        let r=c.getBoundingClientRect();


        if(hit(p,r)){


            lives--;


            updateLives();


            c.remove();



            if(lives<=0){

                end();

            }

        }


    });


}





function hit(a,b){

return(

a.left<b.right &&
a.right>b.left &&
a.top<b.bottom &&
a.bottom>b.top

);

}




function updateLives(){

    livesText.innerHTML="❤️".repeat(lives);

}




function end(){

    running=false;

    finalScore.innerText=score;

    gameOver.style.display="flex";

}





restart.onclick=()=>{


    document.querySelectorAll(".trash,.cat")
    .forEach(e=>e.remove());


    score=0;

    lives=3;

    pointsText.innerText=0;

    updateLives();


    playerX=200;
    playerY=200;


    updatePlayer();


    gameOver.style.display="none";


    running=true;

};





setInterval(spawnTrash,1200);

setInterval(spawnCat,4000);



updateLives();

updatePlayer();

move();
