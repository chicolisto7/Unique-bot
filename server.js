const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  // Endpoint ya frontend ku-request pair code
  app.post("/pair", async (req, res) => {
    const number = req.body.number;
    if (!number) return res.status(400).json({ error: "Number required" });

    try {
      const code = await sock.requestPairingCode(number);
      res.json({ pairCode: code });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to generate pair code" });
    }
  });

  // Save session
  sock.ev.on("creds.update", saveCreds);
}

startBot();

app.listen(PORT, () => console.log(`UNIQUE BOT 𓃬 server running on port ${PORT}`));
