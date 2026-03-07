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

const { connection, lastDisconnect } = update

if(connection === "close"){

const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if(shouldReconnect){
console.log("Reconnecting...")
startSock()
}

}

if(connection === "open"){
console.log("WhatsApp connected successfully")
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
height:100vh;
font-family:sans-serif;
background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
display:flex;
justify-content:center;
align-items:center;
color:white;
overflow:hidden;
}

.card{
backdrop-filter:blur(20px);
background:rgba(255,255,255,0.1);
padding:40px;
border-radius:20px;
text-align:center;
width:90%;
max-width:420px;
box-shadow:0 0 40px rgba(0,255,255,0.3);
}

.title{
font-size:32px;
font-weight:bold;
background:linear-gradient(90deg,red,orange,yellow,green,cyan,blue,violet);
-webkit-background-clip:text;
color:transparent;
animation:rainbow 5s infinite linear;
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
font-size:16px;
background:linear-gradient(90deg,#00c6ff,#0072ff);
color:white;
cursor:pointer;
}

.code{
margin-top:20px;
font-size:28px;
letter-spacing:4px;
background:black;
padding:15px;
border-radius:10px;
}

</style>

</head>

<body>

<div class="card">

<div class="title">UNIQUE BOT 𓃬</div>

<p>Enter WhatsApp number</p>

<input id="num" placeholder="255712345678">

<button onclick="pair()">Generate Pair Code</button>

<div id="code" class="code">----</div>

</div>

<audio autoplay loop>
<source src="https://files.catbox.moe/9h9j2c.mp3" type="audio/mpeg">
</audio>

<script>

async function pair(){

let number = document.getElementById("num").value

let res = await fetch("/pair",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({number})
})

let data = await res.json()

if(data.code){

document.getElementById("code").innerText=data.code

}else{

alert(data.error)

}

}

</script>

</body>
</html>

async function pair(){

let number = document.getElementById("num").value

if(!number){
alert("Enter phone number")
return
}

let res = await fetch("/pair",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({number})
})

let data = await res.json()

if(data.code){
document.getElementById("code").innerText = data.code
}else{
alert(data.error)
}

}

function copyCode(){

let code = document.getElementById("code").innerText

navigator.clipboard.writeText(code)

alert("Code copied")

`)

})

app.post("/pair", async (req,res)=>{

try{

let number = req.body.number

if(!number){

return res.json({
error:"Number required"
})

}

number = number.replace(/[^0-9]/g,"")

if(!sock){

return res.json({
error:"Server not ready"
})

}

const code = await sock.requestPairingCode(number)

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

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
