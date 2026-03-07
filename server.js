const express = require("express")
const pino = require("pino")

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const app = express()

app.use(express.json())

let sock

async function startSock(){

const { state, saveCreds } = await useMultiFileAuthState("./session")

sock = makeWASocket({
logger: pino({ level:"silent" }),
auth: state
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update",(update)=>{

const { connection,lastDisconnect } = update

if(connection === "close"){

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if(shouldReconnect){
startSock()
}

}

if(connection === "open"){
console.log("✅ WhatsApp connected")
}

})

}

startSock()

app.get("/",(req,res)=>{

res.send(`

<!DOCTYPE html>
<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>UNIQUE BOT PAIR</title>

<style>

body{
margin:0;
font-family:sans-serif;
background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
height:100vh;
display:flex;
justify-content:center;
align-items:center;
overflow:hidden;
color:white;
}

.card{

background:rgba(255,255,255,0.08);
backdrop-filter:blur(20px);
padding:40px;
border-radius:20px;
width:90%;
max-width:420px;
text-align:center;
box-shadow:0 0 50px rgba(0,255,255,0.4);

}

.title{

font-size:32px;
font-weight:bold;

background:linear-gradient(
90deg,
red,
orange,
yellow,
green,
cyan,
blue,
violet
);

-webkit-background-clip:text;
color:transparent;

animation:rainbow 5s linear infinite;

}

@keyframes rainbow{
100%{filter:hue-rotate(360deg)}
}

input{

width:100%;
padding:15px;
margin-top:20px;
border:none;
border-radius:10px;
font-size:16px;

}

button{

width:100%;
padding:15px;
margin-top:15px;
border:none;
border-radius:10px;

background:linear-gradient(90deg,#00c6ff,#0072ff);

color:white;
font-size:16px;
cursor:pointer;

}

button:hover{

opacity:0.9;

}

.code{

margin-top:20px;

font-size:28px;

letter-spacing:4px;

background:black;

padding:15px;

border-radius:10px;

}

.loader{

margin-top:20px;

border:4px solid rgba(255,255,255,0.2);
border-top:4px solid white;

border-radius:50%;

width:30px;
height:30px;

animation:spin 1s linear infinite;

display:none;

margin-left:auto;
margin-right:auto;

}

@keyframes spin{
100%{transform:rotate(360deg)}
}

</style>

</head>

<body>

<div class="card">

<div class="title">UNIQUE BOT 𓃬</div>

<p>Enter WhatsApp number with country code</p>

<input id="num" placeholder="255712345678">

<button onclick="pair()">Generate Pair Code</button>

<div class="loader" id="loader"></div>

<div id="code" class="code">----</div>

<button onclick="copy()">Copy Code</button>

</div>

<audio autoplay loop>
<source src="https://files.catbox.moe/9h9j2c.mp3" type="audio/mpeg">
</audio>

<script>

async function pair(){

let number = document.getElementById("num").value

if(!number){
alert("Enter number")
return
}

document.getElementById("loader").style.display="block"

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

document.getElementById("loader").style.display="none"

if(data.code){

document.getElementById("code").innerText=data.code

}else{

alert(data.error)

}

}

function copy(){

let code=document.getElementById("code").innerText

navigator.clipboard.writeText(code)

alert("Code copied")

}

</script>

</body>

</html>

`)

})

app.post("/pair", async (req,res)=>{

try{

let number=req.body.number

if(!number){

return res.json({
error:"Number required"
})

}

number=number.replace(/[^0-9]/g,"")

const code=await sock.requestPairingCode(number)

res.json({
code
})

}catch(e){

console.log(e)

res.json({
error:"Failed to generate code"
})

}

})

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running")

})
