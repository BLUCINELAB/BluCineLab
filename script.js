function toggleStart(){

let m=document.getElementById("startMenu")

if(m.style.display=="block"){

m.style.display="none"

}else{

m.style.display="block"

}

}



function openWindow(id){

let w=document.getElementById(id)

w.style.display="block"

}



function closeWindow(id){

let w=document.getElementById(id)

w.style.display="none"

}



/* DRAG WINDOWS */

document.querySelectorAll(".window").forEach(win=>{

let bar=win.querySelector(".titlebar")

let offsetX
let offsetY
let dragging=false

bar.addEventListener("mousedown",e=>{

dragging=true

offsetX=e.clientX-win.offsetLeft
offsetY=e.clientY-win.offsetTop

})

document.addEventListener("mousemove",e=>{

if(dragging){

win.style.left=e.clientX-offsetX+"px"
win.style.top=e.clientY-offsetY+"px"

}

})

document.addEventListener("mouseup",()=>{

dragging=false

})

})