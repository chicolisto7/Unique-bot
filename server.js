const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

function generatePairCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"
    let code = ""
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}

app.post("/pair", (req, res) => {
    const { number } = req.body

    if (!number) {
        return res.json({ status:false, message:"Enter WhatsApp Number"})
    }

    const code = generatePairCode()

    res.json({
        status:true,
        number:number,
        pair_code:code
    })
})

app.listen(PORT, () => {
    console.log("UNIQUE BOT server running on port " + PORT)
})
