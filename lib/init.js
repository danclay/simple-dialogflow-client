const path = require('path');
const fs = require('fs');

var optionsObj = new Object();
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {Object} options Options
 * @param {string} options.projectID GCP project ID
 * @param {string} options.keyPath Absolute path to the GCP service account JSON key
 * @param {Boolean} [options.convertResult=true] If using a custom response payload and you want it to be given to you in JSON (if used this will be given in result.fulfillmentMessagesJSON)
 * @param {Boolean} [options.storeSessions=true] If you want sessions stored
 * @param {Number} [options.sessionExpires=5] How long until each session ID is deleted (only if options.storeSessions=true)
 * @param {Boolean} [options.easyMode=false] Enable basic mode where the callback will only have the fulfillment text
 * @param {Boolean} [options.debug=false] Enable or disable debug logging
 */
const init = (options) => {
    if (path.isAbsolute(options.keyPath)) {
        if (fs.existsSync(options.keyPath)) {
            Object.defineProperties(optionsObj, {
                creds: {
                    value: {
                        projectID: options.projectID,
                        keyPath: options.keyPath
                    },
                    writable: false
                },
                easyMode: {
                    value: options.easyMode || false,
                    writable: false
                },
                sessionExpires: {
                    value: options.sessionExpires || 5,
                    writable: false
                },
                debug: {
                    value: options.debug || false,
                    writable: false
                },
                convertResult: {
                    value: options.convertResult || true,
                    writable: false
                },
                storeSessions: {
                    value: options.storeSessions || true,
                    writable: false
                }
            });
            console.log("Dialogflow init complete!")
        } else {
            throw new Error(`GCP Key Path "${keyPath}" does not exist.`);
        };
    } else {
        throw new Error(`GCP Key Path "${keyPath}" is not absolute.`);
    };
};

module.exports = {
    options: optionsObj,
    init
};