const cursor=document.querySelector(".cursor")

document.addEventListener("mousemove",e=>{

cursor.style.left=e.clientX+"px"
cursor.style.top=e.clientY+"px"

createSpark(e.clientX,e.clientY)

})

function createSpark(x,y){

const spark=document.createElement("div")

spark.className="spark"

spark.style.left=x+"px"
spark.style.top=y+"px"

document.body.appendChild(spark)

setTimeout(()=>{

spark.remove()

},800)

}