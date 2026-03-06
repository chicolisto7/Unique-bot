const express = require("express")
const path = require("path")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

app.get("/pair", (req,res)=>{

let code = Math.floor(100000 + Math.random()*900000)

res.json({
status:true,
pair_code:code
})

})

app.listen(PORT,()=>{
console.log("UNIQUE BOT server running")
})
