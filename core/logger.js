const chalk = require(`chalk`);

module.exports = class Logger {
    constructor() {
        /** @member {Class} client the active BotClient */
        this.client;

        /** @member {Object} config load config data */
        this.config = require(`./config.js`);

        /** @member {Object} guild fetch guild object for Online College */
        this.guild;

        /** @member {Object} consoleChannel fetch channel object for consoleChannel */
        this.consoleChannel;

        /** @member {Object} dmChannel fetch channel object for dmChannel */
        this.dmChannel;
    }

    /**
     * Initializer function for the Logger Class - set this.guild & this.consoleChannel
     * @param {String} guildID ID of the guild
     * @param {Object} channels IDs of the channel stored in config.js
     */
    async init(guildID = this.config.SERVER_ID.DEVELOPMENT, channels = this.config.CHANNELS) {
        this.guild = await this.client.guilds.fetch(guildID);
        this.consoleChannel = await this.guild.channels.fetch(channels.TEST_CONSOLE);
        this.dmChannel = await this.guild.channels.fetch(channels.TEST_DIRMSGS);

        this.console(`DEBUG`, `Initalized Guild & Channel Objects`, [`- Fetched guild`, `- Fetched console & DM channels`]);

        return;
    }

    /**
     * @remove testing function: Called by interactionCreate.js. Will be deleted
     */
    test() {
        this.console(`WARNING`, `Good Warning`, `This warning is correct with a single string for message input`);
        this.console(`INFO`, `Just some info`, [`This is arr index 0`, `the title of this is also green, since it has a message payload attached`]);
        this.console(`WARNIdwNG`, `The loglevel is misspelled on purpose`, `this is a single string`);
        this.console(`POOP`, `SOME TITLE`, [`this is element 0 of an array`, `This is the POOP warning`]);
    }

    /**
     * Log all relevant console events
     * @param {String} level INFO/DEBUG/WARNING/ERROR
     * @param {String} title title of message to log to console
     * @param {String|String[]} message details as string (single line) or array (for multi-line output)
     * @param {Stack} error stack (only for errors)
     * @param {Date} timestamp timestamp of log to console
     * @param {Object} channel channel object to send messages to
     */
    console(level, title, message, error, timestamp = Date.now(), channel = this.consoleChannel) {
        // initialize blank output object & message array
        const out = {};
        let outMsgArr = [];

        // set constant padding length
        const messagePadding = ``.padStart(7);
        out.level = level.padStart(7);

        // get human-readable date & time in CST
        const time = new Date(timestamp).toLocaleString("en-US", { timeZone: `CST`, month: `short`, day: `2-digit`, hour: `numeric`, minute: `numeric` });

        // switch level to determine & store formatting
        let defaultedCase = false;
        switch (level) {
            case `INFO`:
                if (message) {
                    out.titleLine = `${chalk.green(time)} | ${chalk.green(out.level)} : ${chalk.green(title)}`;
                } else {
                    out.titleLine = `${chalk.green(time)} | ${chalk.green(out.level)} : ${title}`;
                }
                break;

            case `DEBUG`:
                out.titleLine = `${chalk.blue(time)} | ${chalk.blue(out.level)} : ${chalk.blue(title)}`;
                break;

            case `WARNING`:
                out.titleLine = `${chalk.yellow(time)} | ${chalk.yellow(out.level)} : ${chalk.yellow(title)}`;
                break;

            case `ERROR`:
                out.titleLine = `${chalk.red(time)} | ${chalk.red(out.level)} : ${chalk.red(title)}`;
                message = error.replace(/(?<=\()(.*)(?<=Wall-E)/gm, `.`).split("\n", 4);
                break;

            default:
                defaultedCase = true;
                outMsgArr.push(`Check spelling while calling the console logger`);
                outMsgArr.push(`===============================================`);
                outMsgArr.push(`Original log: ${chalk.yellow(title)}`);
                if (Array.isArray(message)) {
                    message.forEach(msg => {
                        outMsgArr.push(messagePadding + msg);
                    });
                } else {
                    outMsgArr.push(messagePadding + message);
                }
                this.console(`WARNING`, `Misspelled Log Level Passed to Logging Function`, outMsgArr);
                break
        }

        // if function hits the "default" case, break execution of function since a new this.console() function is called
        if (defaultedCase) return;

        // Convert multi-line message (passed as Array) to a single string delimited by newline characters
        if (Array.isArray(message)) {
            message.forEach(msg => {
                outMsgArr.push(messagePadding + msg);
            });
            out.messageLine = outMsgArr.join(`\n`);
        } else if (message) {
            out.messageLine = messagePadding + message;
        }

        // Output to console. If there are messages or an error stack, output those too
        console.log(out.titleLine)
        if (out.messageLine) console.log(out.messageLine);
        // if (error) console.log(error);
        return;
    }

    /**
     * Capture DMs sent to Wall-E & log them in a DM channel
     * @param {Object} member user who sent the DM
     * @param {Object} message discord message object
     */
    dm(member, message) {
        this.console(`INFO`, `Recieved DM from ${member.tag}`);

        let descriptionBody = `**New direct message from** \`${member.tag}\``;
        let footer = {
            text: `New direct message from: ${member.tag}`,
            iconURL: member.displayAvatarURL()
        };

        if (message.content) { descriptionBody = `> "*${message.content}*"` }
        if (message.content) { footer }

        const embedObject = {
            color: this.config.EMBED_COLORS.LOG_DMS,
            description: descriptionBody,
            footer: footer
        }

        const embed = this.client.embedGenerator(embedObject)
        this.dmChannel.send({ embeds: [embed], files: [] })
        // console.log(embed)
    }
}
