const express = require("express")
const pino = require("pino")

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const app = express()
app.use(express.json())
app.use(express.static("public"))

let sock

async function startSock(){

const { state, saveCreds } = await useMultiFileAuthState("session")

sock = makeWASocket({
logger: pino({ level: "silent" }),
auth: state
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update",(update)=>{

const { connection,lastDisconnect } = update

if(connection === "close"){

if(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut){
startSock()
}

}

})

}

startSock()

app.post("/pair", async (req,res)=>{

try{

const number = req.body.number

if(!number){

return res.json({
status:false,
message:"Enter phone number"
})

}

const code = await sock.requestPairingCode(number)

res.json({
status:true,
code:code
})

}catch(err){

res.json({
status:false,
error:err.message
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("UNIQUE BOT server running")

})
