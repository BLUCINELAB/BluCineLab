document.addEventListener("DOMContentLoaded", () => {



/* ======================
BOOT
====================== */

const boot = document.getElementById("bootScreen")

setTimeout(() => {

boot.style.display = "none"

}, 3000)




/* ======================
START MENU
====================== */

const startMenu = document.getElementById("startMenu")

window.toggleStart = function(){

if(startMenu.style.display === "block"){

startMenu.style.display = "none"

}else{

startMenu.style.display = "block"

}

}



/* ======================
WINDOW CONTROL
====================== */

window.openWindow = function(id){

const w = document.getElementById(id)

w.style.display = "block"

w.style.zIndex = Date.now()

startMenu.style.display = "none"

}

window.closeWindow = function(id){

document.getElementById(id).style.display = "none"

}




/* ======================
CLOCK
====================== */

const clock = document.getElementById("clock")

function updateClock(){

const now = new Date()

let h = now.getHours()
let m = now.getMinutes()

if(m < 10) m = "0" + m

clock.innerText = h + ":" + m

}

setInterval(updateClock,1000)

updateClock()




/* ======================
DRAG WINDOWS
====================== */

let currentWindow = null
let offsetX = 0
let offsetY = 0

document.querySelectorAll(".window").forEach(win => {

win.addEventListener("mousedown", e => {

currentWindow = win

offsetX = e.clientX - win.offsetLeft
offsetY = e.clientY - win.offsetTop

win.style.zIndex = Date.now()

})

})



document.addEventListener("mousemove", e => {

if(currentWindow){

currentWindow.style.left =
e.clientX - offsetX + "px"

currentWindow.style.top =
e.clientY - offsetY + "px"

}

})



document.addEventListener("mouseup", () => {

currentWindow = null

})



})