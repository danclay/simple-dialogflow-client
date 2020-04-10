<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/@danclay/discord-dialogflow"><img src="https://img.shields.io/npm/v/@danclay/discord-dialogflow.svg?cacheSeconds=3600&style=flat-square" alt="NPM version" /></a>
    <a href="https://raw.githubusercontent.com/danclay/discord-dialogflow/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@danclay/discord-dialogflow?style=flat-square">
    <a href="https://david-dm.org/danclay/discord-dialogflow"><img src="https://img.shields.io/david/danclay/discord-dialogflow.svg?cacheSeconds=3600&style=flat-square" alt="Dependencies" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/@danclay/discord-dialogflow/"><img src="https://nodei.co/npm/@danclay/discord-dialogflow.png"></a>
  </p>
</div>

# About

Easily integrate Dialogflow into your Discord bot to allow for natural conversations 

# Installation
To download eris-sharder, run `npm install @danclay/discord-dialogflow --save`
or with yarn: `yarn add @danclay/discord-dialogflow`

# Usage

Basics:
```javascript
const dialogflow = require('discord-dialogflow'); // requires the package
dialogflow.init("project-id", "path-to-service-account-key.json"); // init your project
dialogflow.getIntent(msg, r => { // get the intent
    // code using the results
});
```

Example using Eris and easy mode (as seen in [test/test.js](https://raw.githubusercontent.com/danclay/discord-dialogflow/master/test/test.js)):
```javascript
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

bot.on("guildMemberAdd", (guild, member) => { // automatically adds role on join
    if (guild.id === "481609857993146378" && !member.bot) {
        member.addRole(process.env.role_to_assign);
    };
});
});
```