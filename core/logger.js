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

        this.console({
            level: `DEBUG`,
            title: `Initalized Guild & Channel Objects`,
            message: [
                `- Fetched guild`,
                `- Fetched console & DM channels`
            ],
        });

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
    consoleOld(level, title, message, error, timestamp = Date.now(), channel = this.consoleChannel) {
        
        this.console1({
            level: level,
            title: title,
            message: message ? message : undefined,
            stack: error,
        })
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
                    out.titleLine = `${green(time)} | ${chalk.green(out.level)} : ${chalk.green(title)}`;
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
        // console.log(message)
        // console.log(Array.isArray(message))
        if (Array.isArray(message)) {
            message.forEach(msg => {
                outMsgArr.push(messagePadding + msg);
            });
            out.messageLine = outMsgArr.join(`\n`);
        } else if (message) {
            out.messageLine = messagePadding + message;
        }

        // Output to console. If there are messages or an error stack, output those too
        // console.log(out.titleLine)
        // if (out.messageLine) console.log(out.messageLine);
        // if (error) console.log(error);
        return;
    }

    console(consoleObject) {
        /**
        client.logger.console({
            level: ``,
            title: ``,
            message: [``],
            stack: stack,
        });
         */
        const { level, title, message, stack, timestamp = Date.now() } = consoleObject;
        const { green, blue, yellow, red } = chalk;
        const out = { message: [] };
        let outMsgArr = [];

        // console.log(consoleObject)

        // set constant padding length
        const messagePadding = ``.padStart(7);
        out.level = level.padStart(7);

        // get human-readable date & time in CST
        const time = new Date(timestamp).toLocaleString("en-US", { timeZone: `CST`, month: `short`, day: `2-digit`, hour: `numeric`, minute: `numeric` });

        /** @todo console log err */
        if (![`INFO`, `DEBUG`, `WARNING`, `ERROR`].includes(level)) return

        switch (level) {
            case `INFO`:
                out.title = `${green(time)} | ${green(out.level)} : ` + (message ? green(title) : title);
                break;

            case `DEBUG`:
                out.title = `${blue(time)} | ${blue(out.level)} : ${blue(title)}`;
                break;

            case `WARNING`:
                out.title = `${yellow(time)} | ${yellow(out.level)} : ${yellow(title)}`;
                break;

            case `ERROR`:
                out.title = `${red(time)} | ${red(out.level)} : ${red(title)}`;
                break;
        }

        // if the message is an array of messages or a single line
        if (Array.isArray(message)) {
            message.forEach(msg => {
                out.message.push(messagePadding + msg);
            });
            // out.message = outMsgArr.join(`\n`);
        } else if (message) {
            out.message.push(messagePadding + message);
        }

        // console.log(out.message)
        if (stack) {
            out.message.push(red(`----------------------------------- STACK -----------------------------------`));
            const stackArr = stack.replaceAll(__dirname.replace(`core`, ``), `.\\`).split("\n", 4);
            stackArr.forEach(line => {
                out.message.push(messagePadding + line);
            })
        }

        console.log(out.title);
        if (out.message.length > 0) console.log(out.message.join(`\n`));
    }

    /**
     * Capture DMs sent to Wall-E & log them in a DM channel
     * @param {Object} member user who sent the DM
     * @param {Object} message discord message object
     */
    dm(member, message) {
        /** @TODO rework to more gracefully determine message type & handle attachments */
        this.console(`INFO`, `Recieved DM from ${member.tag}`);

        let descriptionBody = `**New direct message from** \`${member.tag}\``;
        let footer = {
            text: `New direct message from: ${member.tag}`,
            iconURL: member.displayAvatarURL()
        };

        if (message.content) descriptionBody = `> "*${message.content}*"`;

        // create & send the embed
        const embed = this.client.embedCreate({
            color: this.config.EMBED_COLORS.LOG_DMS,
            description: descriptionBody,
            footer: footer
        });
        this.dmChannel.send({ embeds: [embed], files: [] });
    }
}
