const uuid = require('uuid').v4;
const path = require('path');
const convert = require('./structJson').structProtoToJson;

const dialogflow = require('dialogflow');
var sessions = []; // array of objects of sessions

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @async
 * @param {Object} msg message object
 * @param {Object} [msg.author.id] If not using a custom query, this is needed for the ID
 * @param {string} [msg.locale] message locale if you want it to not be English (only if no using custom query) (e.g.'en-US')
 * @param {Object} [msg.query] custom dialogflow query
 * @param {Number} [msg.query.user] user ID for session storage if using a custom query
 * @param {callback} callback callback function
 */
async function getIntent(msg, callback) {
    var options = require('./init').options;
    if (options.creds) {

        const sessionId = () => { // A unique identifier for the given session
            if (options.storeSessions) {

                var userID; // user IDs management if query is custom
                if (msg.query) {
                    userID = msg.query.user;
                } else {
                    userID = msg.author.id;
                };

                const s = sessions.find(s => s.user === userID);
                const newId = () => { // gets new ID
                    const id = uuid();
                    sessions.push({
                        user: userID,
                        id: id,
                        expires: new Date(new Date().getTime() + process.env.session_expires * 60000)
                    });
                    return id;
                };
                if (s) {
                    if (s.expires > new Date()) {
                        sessions.splice(sessions.indexOf(s), 1);
                        return newId();
                    } else {
                        return s.id;
                    };
                } else {
                    return newId();
                };
            } else {
                return uuid();
            }
        };
        //console.log(sessionId());

        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({
            keyFilename: options.creds.keyPath
        });
        const sessionPath = sessionClient.sessionPath(options.creds.projectID, sessionId());

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: msg.query || { // if there is a custom query use the custom query, else use
                text: {
                    // The query to send to the dialogflow agent
                    text: msg.content,
                    // The language used by the client (en-US)
                    languageCode: msg.locale || 'en-US'
                },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        if (options.debug && msg.id) console.log('Detected intent for ' + msg.id);
        var result = responses[0].queryResult;
        if (options.debug && msg.id) console.log(`  ${msg.id} Query: ${result.queryText}`);
        if (options.debug && msg.id) console.log(`  ${msg.id} Response: ${result.fulfillmentText}`);
        if (result.intent) {
            if (options.debug && msg.id) console.log(`  ${msg.id} Intent: ${result.intent.displayName}`);
        } else {
            if (options.debug && msg.id) console.log(`  ${msg.id}: No intent matched.`);
        };

        if (options.convertResult) {
            result.fulfillmentMessagesJSON = result.fulfillmentMessages.map(obj => { // converts 
                if (obj.payload) {
                    return convert(obj.payload);
                } else {
                    return obj;
                };
            });
        };

        /**
         * @callback callback callback with result
         * @param {Object} result result object or string if using easy mode
         */
        if (options.easyMode) {
            callback(result.fulfillmentText);
        } else {
            callback(result);
        };
    } else {
        throw new Error("You need to init discord-dialogflow");
    }
};

module.exports = getIntent;