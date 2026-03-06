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

<title>UNIQUE BOT</title>

<style>

body{
margin:0;
font-family:Arial;
background:#0f172a;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
color:white;
}

.box{
width:95%;
max-width:420px;
background:#1e293b;
padding:30px;
border-radius:15px;
text-align:center;
}

.title{
font-size:30px;
font-weight:bold;
background:linear-gradient(90deg,red,orange,yellow,green,cyan,blue,violet);
-webkit-background-clip:text;
color:transparent;
animation:rainbow 5s linear infinite;
}

@keyframes rainbow{
100%{filter:hue-rotate(360deg)}
}

input{
width:100%;
padding:14px;
margin-top:20px;
border:none;
border-radius:8px;
font-size:16px;
}

button{
width:100%;
padding:14px;
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
font-size:24px;
letter-spacing:3px;
}

.copy{
margin-top:10px;
background:#2563eb;
}

</style>

</head>

<body>

<div class="box">

<div class="title">UNIQUE BOT 𓃬</div>

<p>Enter WhatsApp Number</p>

<input id="num" placeholder="255712345678">

<button onclick="pair()">Generate Pair Code</button>

<div id="code" class="code">----</div>

<button class="copy" onclick="copyCode()">Copy Code</button>

</div>

<script>

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

}

</script>

</body>
</html>

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
