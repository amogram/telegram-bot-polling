import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("TELEGRAM_BOT_TOKEN environment variable is not set.");
    process.exit(1);
}

const allowedChatId = process.env.TELEGRAM_CHAT_ID;
if (!allowedChatId) {
    console.error("TELEGRAM_CHAT_ID environment variable is not set.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("Bookmark poller running. Waiting for messages in Telegram...");

bot.on("channel_post", async (msg) => {
    try {
        const chatId = msg.chat.id;
        const text = msg.text?.trim();

        if (!text) return;

        if (chatId.toString() !== allowedChatId) {
            console.warn(`Received message from unauthorized chat ID: ${chatId}`);
            return;
        }

        // Url extraction
        const urlMatch = text.match(/(https?:\/\/[^\s<>"')\]]+)/g);
        if (!urlMatch) return;

        const url = urlMatch[0];
        console.log(`Received URL: ${url} from chat ID: ${chatId}`);
        console.log(`Date receoived: ${new Date(msg.date * 1000).toISOString()}`);

        // Extract hashtags as tags
        const tags = [];
        const tagMatches = text.match(/#([\w-]+)/g);
        if (tagMatches) {
            tagMatches.forEach(tag => {
                tags.push(tag.substring(1)); // Remove the '#' character
            });
        }

        console.log(`Extracted tags: ${tags.join(", ")}`);

        bot.sendMessage(chatId, `Got it! Saving your bookmark...`);

    } catch (error) {
        console.error("Error processing message:", error);
        try {
            await bot.sendMessage(msg.chat.id, 'Failed to save bookmark.');
        } catch (sendError) {
            console.error("Error sending error message:", sendError);
        }
    }
});