async function generatePair(){

const number = document.getElementById("number").value

const result = document.getElementById("result")

result.innerHTML = "Generating..."

const res = await fetch("/pair",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({number:number})
})

const data = await res.json()

if(data.status){

result.innerHTML = "PAIR CODE : " + data.pair_code

}else{

result.innerHTML = data.message

}

}
