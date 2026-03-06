const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═══════════════════════════════╗
    🔥 *UNIQUE-BOT-𓃬* 🔥
    ✨ Version: *${settings.version || '4.0.0'}*
    👑 Owner: *Chicolisto*
    📞 Owner Number: *255745003309*
    🔗 Prefix: *${settings.prefix || '.'}*
    🎮 Channel: *${global.channelLink || 'Join our channel'}*
╚═══════════════════════════════╝

╔═══════════════════════════════╗
         🧠 *MAIN MENU* 🧠
╠═══════════════════════════════╣
║ 🎯 *ALL COMMANDS*: *.help all*
║ 🔥 *ANIMATION*: *.help anime*
║ 🛡️ *ADMIN*: *.help admin*
║ 👑 *OWNER*: *.help owner*
║ 🎨 *MEDIA*: *.help media*
║ 🎮 *GAMES*: *.help games*
║ 🤖 *AI*: *.help ai*
║ 🎭 *FUN*: *.help fun*
║ 🎵 *MUSIC*: *.help music*
║ ⚡ *TOOLS*: *.help tools*
║ 📥 *DOWNLOADER*: *.help download*
║ 🔤 *TEXT MAKER*: *.help textmaker*
║ 🖼️ *IMAGE EDIT*: *.help image*
╚═══════════════════════════════╝

╔═══════════════════════════════╗
         ⚡ *QUICK COMMANDS* ⚡
╠═══════════════════════════════╣
║ 🌀 *.ping* - Check bot speed
║ ❤️ *.alive* - Check bot status
║ 👑 *.owner* - Contact owner
║ 🎮 *.tictactoe* - Play Tic Tac Toe
║ 🎭 *.meme* - Get random meme
║ 🎵 *.song* - Download music
║ 🎬 *.video* - Download video
║ 🖼️ *.sticker* - Create sticker
║ 🤖 *.gpt* - Ask AI questions
║ 🎨 *.imagine* - AI image generation
╚═══════════════════════════════╝

╔═══════════════════════════════╗
         🔥 *PERSONALITY* 🔥
╠═══════════════════════════════╣
║ *Name*: UNIQUE BOT 𓃬 
║ *From*: Unique Tech pro 𓃬
║ *Traits*: Fiery 🔥 Passionate ❤️
║ *Catchphrase*: "Dattebane!" ✨
║ *Mood*: Protective & Loving 🛡️
║ *Created by*: Chicolisto 👑
╚═══════════════════════════════╝

╔═══════════════════════════════╗
      🛡️ POWERED BY 𝐔𝐍𝐈𝐐𝐔𝐄 𝐓𝐄𝐂𝐇 𝐏𝐑𝐎𓃬 🛡️
╚═══════════════════════════════╝

✨ *Use specific help commands above*
✨ *Type .help <category> for details*
✨ *Example: .help admin for admin cmds*

🔥 *Believe it! I'm ready to serve!* 🔥
🍥 *Dattebane! Ask me anything!* 🍥`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363404917414335@newsletter',
                        newsletterName: 'UNIQUE BOT 𓃬',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            console.error('🔥 UNIQUE BOT 𓃬: Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363404917414335@newsletter',
                        newsletterName: 'UNIQUE BOT 𓃬 by Chicolisto',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('🔥 UNIQUE BOT 𓃬: Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;