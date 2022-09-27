const { chalk } = import(`chalk`);

const BotClient = require(`./botClient.js`);

module.exports = class Logger {
    constructor(client) {

        /** @member {Class} client the active BotClient */
        this.client = client;

        /** @member {Date} date stores current date when class is called */
        this.date = Date.now();

        /** @member {Object} config load config data */
        this.config = require(`./config.js`);
    }

    /**
     * log all relevant console events
     * @param {String} level INFO/DEBUG/WARNING/ERROR
     * @param {String} title title of message to log to console
     * @param {String} message body to log
     * @param {Stack} error stack (only for errors)
     */
    console(level, title, message, error) {

    }

    /**
     * Capture DMs sent to Wall-E & log them in a DM channel
     * @param {Object} member user who sent the DM
     * @param {Object} message discord message object
     */
    dm(member, message) {
        //TODO: Look into replying to DMs via modals
    }

    /**
     * Log transcript based messages in correct channel
     * @param {String} type of transcript (support || modapp)
     * @param {Object} member subject of transcript
     * @param {Array} transcript transcript array
     */
    transcript(type, member, transcript) {

    }
}
