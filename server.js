const express = require("express")
const pino = require("pino")

const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const app = express()
app.use(express.json())

let sock

async function start(){

const { state, saveCreds } = await useMultiFileAuthState("./session")

sock = makeWASocket({
logger: pino({ level:"silent" }),
auth: state
})

sock.ev.on("creds.update", saveCreds)

}

start()

app.get("/",(req,res)=>{

res.send(`

<!DOCTYPE html>
<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>UNIQUE BOT</title>

<style>

body{
margin:0;
font-family:sans-serif;
background:#0f172a;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
color:white;
}

.box{

width:90%;
max-width:420px;
background:#1e293b;
padding:30px;
border-radius:15px;
text-align:center;
box-shadow:0 0 25px black;

}

.title{

font-size:28px;
font-weight:bold;
background:linear-gradient(90deg,red,orange,yellow,green,cyan,blue,violet);
-webkit-background-clip:text;
color:transparent;
animation:rainbow 6s linear infinite;

}

@keyframes rainbow{
100%{filter:hue-rotate(360deg)}
}

input{

width:100%;
padding:12px;
margin-top:20px;
border:none;
border-radius:8px;
font-size:16px;

}

button{

width:100%;
padding:12px;
margin-top:15px;
border:none;
border-radius:8px;
background:#22c55e;
font-size:16px;
cursor:pointer;

}

.code{

margin-top:20px;
background:black;
padding:15px;
border-radius:10px;
font-size:22px;

}

</style>

</head>

<body>

<div class="box">

<div class="title">UNIQUE BOT 𓃬</div>

<p>WhatsApp Pair Code Generator</p>

<input id="num" placeholder="255712345678">

<button onclick="pair()">Generate Code</button>

<div id="code" class="code">----</div>

</div>

<script>

async function pair(){

let number = document.getElementById("num").value

let res = await fetch("/pair",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
number:number
})
})

let data = await res.json()

if(data.code){

document.getElementById("code").innerText = data.code

}else{

alert("Error generating code")

}

}

</script>

</body>

</html>

`)

})

app.post("/pair", async (req,res)=>{

try{

let number = req.body.number

let code = await sock.requestPairingCode(number)

res.json({
code:code
})

}catch(err){

res.json({
error:"Failed"
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("UNIQUE BOT running")

})
