import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("TELEGRAM_BOT_TOKEN environment variable is not set.");
    process.exit(1);
    }

const bot = new TelegramBot(token, { polling: true });

console.log("Listening for messages...");

function log(label, msg) {
    console.log(`\n=== ${label} ===`);
    console.log(JSON.stringify({
        chat: msg.chat,
        from: msg.from,
        text: msg.text,
        entities: msg.entities,
    }, null, 2));
}

bot.on("message", (msg) => {
    log("Received message", msg);
});

bot.on("channel_post", (msg) => {
    log("Channel post", msg);
});