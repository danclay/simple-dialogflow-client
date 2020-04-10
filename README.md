<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/@danclay/discord-dialogflow"><img src="https://img.shields.io/npm/v/@danclay/discord-dialogflow.svg?cacheSeconds=3600&style=flat-square" alt="NPM version" /></a>
    <a href="https://raw.githubusercontent.com/danclay/discord-dialogflow/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@danclay/discord-dialogflow?style=flat-square">
    <a href="https://david-dm.org/danclay/discord-dialogflow"><img src="https://img.shields.io/david/danclay/discord-dialogflow.svg?cacheSeconds=3600&style=flat-square" alt="Dependencies" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/@danclay/discord-dialogflow/"><img src="https://nodeico.herokuapp.com/@danclay/discord-dialogflow.svg"></a>
  </p>
</div>

### [Documentation](https://danclay.github.io/discord-dialogflow/) | [Eris](https://abal.moe/Eris/docs/index.html) | [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

# About

Easily integrate Dialogflow into your Discord bot to allow for natural conversations. This should work with the message object for both Eris and discord.js

# Installation
To download eris-sharder, run `npm install @danclay/discord-dialogflow --save`
or with yarn: `yarn add @danclay/discord-dialogflow`

# Usage

## Config
To configure the bot, use the `init(options)` function of this package. The options parameter is a object as follows:
| Name           | Type    | Optional? | Default | Description                                                                                                                                  |
|----------------|---------|-----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
| projectID      | string  |           |         | GCP project ID                                                                                                                               |
| keyPath        | string  |           |         | Absolute path to the GCP service account JSON key                                                                                            |
| convertResult  | Boolean | Yes       | true    | If using a custom response payload and you want it to be given to you in JSON (if used this will be given in result.fulfillmentMessagesJSON) |
| storeSessions  | Boolean | Yes       | true    | If you want sessions IDs to remain to same for specific users                                                                                |
| sessionExpires | Number  | Yes       | 5       | How long until each session ID is deleted (only if options.storeSessions=true)                                                               |
| easyMode       | Boolean | Yes       | false   | Enable basic mode where the callback will only have the fulfillment text                                                                     |
| debug          | Boolean | Yes       | false   | Enable or disable debug logging                                                                                                              |

## Getting a result
To get a result object from dialogflow, use the `getIntent(msg, callback)` function of this package. The parameters are as follows:
### Parameters:
| Name     | Type     | Description                                                    |
|----------|----------|----------------------------------------------------------------|
| msg      | Object   | message object (see below)                                     |
| callback | callback | callback function (result object or string if using easy mode) |

### Msg parameter:
| Name      | Type   | Optional? | Description                                                                                   |
|-----------|--------|-----------|-----------------------------------------------------------------------------------------------|
| author.id | Object | Yes       | If not using a custom query, this is needed for the ID                                        |
| locale    | string | Yes       | message locale if you want it to not be English (only if no using custom query) (e.g.'en-US') |
| query     | Object | Yes       | custom dialogflow query                                                                       |

## Basics
```javascript
const dialogflow = require('discord-dialogflow'); // requires the package
dialogflow.init("project-id", "path-to-service-account-key.json"); // init your project
dialogflow.getIntent(msg, r => { // get the intent
    // code using the results
});
```

### Example using Eris and easy mode 
(as seen in [test/test.js](https://raw.githubusercontent.com/danclay/discord-dialogflow/master/test/test.js)):
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
});
```

### Example using Eris and easy mode disabled:
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
    easyMode: false,
    debug: true
});


bot.on("messageCreate", async (msg) => {
    if (!msg.author.bot) {
        dialogflow.getIntent(msg, (r) => { // gets the intent and fallback text
            console.log(JSON.stringify(r));
            console.log(JSON.stringify(r.fulfillmentMessagesJSON[0].discord));
            bot.createMessage(msg.channel.id, {embed: r.fulfillmentMessagesJSON[0].discord});
        });
    };
});
bot.connect();
```