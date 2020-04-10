if (!(process.env.NODE_ENV === "production")) { // Use dotenv for local testing
    require('dotenv').config();
};

const Eris = require('eris');

var bot = new Eris(process.env.token);
bot.on("ready", () => {
    console.log("Ready!");
});

// Dialogflow
const dialogflow = require('../index.js'); // require the package (use the package name "discord-dialogflow" when you do it)
dialogflow.init({
    projectID: process.env.projectID,
    keyPath: process.env.keyPath,
    easyMode: true,
    debug: true
});


bot.on("messageCreate", async (msg) => {
    if (!msg.author.bot) {
        dialogflow.getIntent(msg, (r) => { // gets the intent and fallback text
            bot.createMessage(msg.channel.id, r);
        });
    };
});
bot.connect();