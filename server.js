const express = require("express")
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

function generateCode(){
const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"
let code = ""
for(let i=0;i<8;i++){
code += chars[Math.floor(Math.random()*chars.length)]
}
return code
}

app.get("/", (req,res)=>{

res.send(`
<!DOCTYPE html>
<html>
<head>

<title>UNIQUE BOT 𓃬</title>

<style>

body{
margin:0;
font-family:Arial;
background:linear-gradient(135deg,#141e30,#243b55);
height:100vh;
display:flex;
justify-content:center;
align-items:center;
color:white;
}

.box{
background:rgba(255,255,255,0.1);
padding:40px;
border-radius:15px;
text-align:center;
width:300px;
backdrop-filter:blur(10px);
}

input{
width:90%;
padding:10px;
border:none;
border-radius:6px;
margin-bottom:15px;
}

button{
padding:10px 20px;
border:none;
background:#00ffcc;
border-radius:6px;
cursor:pointer;
font-weight:bold;
}

#result{
margin-top:20px;
font-size:20px;
color:#00ffcc;
}

</style>

</head>

<body>

<div class="box">

<h2>UNIQUE BOT 𓃬</h2>

<p>WhatsApp Pair Code</p>

<input id="number" placeholder="Enter Number">

<button onclick="pair()">Generate Code</button>

<div id="result"></div>

</div>

<script>

async function pair(){

let number = document.getElementById("number").value

let res = await fetch("/pair",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({number:number})
})

let data = await res.json()

document.getElementById("result").innerHTML = "PAIR CODE : " + data.code

}

</script>

</body>
</html>
`)
})

app.post("/pair",(req,res)=>{

const code = generateCode()

res.json({
code:code
})

})

app.listen(PORT,()=>{
console.log("Server running")
})
