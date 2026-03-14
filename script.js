document.addEventListener("DOMContentLoaded",()=>{

/* =====================
START MENU
===================== */

const startBtn = document.getElementById("startBtn")
const startMenu = document.getElementById("startMenu")

if(startBtn){

startBtn.onclick=()=>{

if(startMenu.style.display==="block"){

startMenu.style.display="none"

}else{

startMenu.style.display="block"

}

}

}


/* =====================
WINDOW CONTROL
===================== */

window.openWindow = function(id){

document.getElementById(id).style.display="block"

startMenu.style.display="none"

}

window.closeWindow = function(id){

document.getElementById(id).style.display="none"

}






/* =====================
PLAYROOM MENU
===================== */

window.showMenu = function(){

hideGames()

document.getElementById("menu").style.display="block"

}

window.startGame = function(id){

hideGames()

document.getElementById("menu").style.display="none"

document.getElementById(id).style.display="block"

}


function hideGames(){

const games=document.querySelectorAll(".game")

games.forEach(g=>g.style.display="none")

}



/* =====================
MARIO
===================== */

let player=document.getElementById("player")

let x=100
let y=0
let vy=0

let jumping=false


document.addEventListener("keydown",e=>{

const mario=document.getElementById("mario")

if(mario.style.display==="block"){

if(e.key==="ArrowRight"){

x+=10

}

if(e.key==="ArrowLeft"){

x-=10

}

if(e.key===" " && !jumping){

vy=15
jumping=true

}

player.style.left=x+"px"

}

})


function loop(){

if(jumping){

y+=vy

vy-=1

if(y<=0){

y=0
jumping=false

}

player.style.bottom=(100+y)+"px"

}

requestAnimationFrame(loop)

}

loop()



/* =====================
COOKING
===================== */

let points=0

window.cook=function(){

points++

document.getElementById("score").innerText=points

}



})