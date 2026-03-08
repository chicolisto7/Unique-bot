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
let ready = false

async function startSock(){

const { state, saveCreds } = await useMultiFileAuthState("./session")

sock = makeWASocket({
logger: pino({ level:"silent" }),
auth: state
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update",(update)=>{

const { connection,lastDisconnect } = update

if(connection === "open"){
console.log("WhatsApp connected")
ready = true
}

if(connection === "close"){

ready = false

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if(shouldReconnect){
startSock()
}

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
font-family:sans-serif;
background:linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb2d);
height:100vh;
display:flex;
justify-content:center;
align-items:center;
color:white;
}

.box{
background:rgba(0,0,0,0.5);
padding:40px;
border-radius:20px;
text-align:center;
width:90%;
max-width:400px;
backdrop-filter:blur(15px);
}

.title{
font-size:30px;
font-weight:bold;
margin-bottom:10px;
}

input{
width:100%;
padding:12px;
border:none;
border-radius:8px;
margin-top:15px;
}

button{
width:100%;
padding:12px;
margin-top:15px;
border:none;
border-radius:8px;
background:#00ffcc;
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

</style>

</head>

<body>

<div class="box">

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

let number=document.getElementById("num").value

let res=await fetch("/pair",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({number})
})

let data=await res.json()

if(data.code){
document.getElementById("code").innerText=data.code
}else{
alert(data.error)
}

}

</script>

</body>
</html>

`)

})

app.post("/pair", async (req,res)=>{

try{

if(!ready){

return res.json({
error:"Server still connecting..."
})

}

let number=req.body.number

if(!number){

return res.json({
error:"Enter phone number"
})

}

number = number.replace(/[^0-9]/g,"")

const code = await sock.requestPairingCode(number)

res.json({code})

}catch(err){

console.log(err)

res.json({
error:"Failed to generate code"
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Server started")

})
