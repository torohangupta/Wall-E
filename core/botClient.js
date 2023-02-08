const fs = require(`fs`);

const { Client, Collection, MessageEmbed } = require("discord.js");

module.exports = class BotClient extends Client {
    constructor(environment) {
        super({
            intents: [`GUILDS`, `GUILD_MESSAGES`, `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `GUILD_MEMBERS`, `GUILD_PRESENCES`, `DIRECT_MESSAGES`],
            partials: ['CHANNEL'],
        });

        this.config = require(`./config.js`); // load the config file
        this.emotes = require(`../utils/resources/emotes.js`); // load the emote refrences
        this.environment = environment; // environment bot is in (dev || live)

        /** @type {Collection} - slash commands collection */
        this.slashCommands = new Collection();

        /** @type {Collection} - select menus collection */
        this.selectMenus = new Collection();

        /** @type {Collection} - button manager collection */
        this.buttons = new Collection();

        /** @member {Class} logger instanciated by ready.js  */
        this.logger;
    };

    /**
     * Load event handlers from specified directory
     * @param {String} directory
     */
    loadEvents(directory) {
        /* TODO: Load events
            - Log function start
            - Track successful & unsuccessful event loads
            - Offload file validation to getFilePath(dir, ext)?
        */

        // get event files & filter by .js files
        const eventFiles = fs.readdirSync(directory);
        let success = 0;
        let failure = 0;

        // turn on event handlers
        eventFiles.forEach(eventFile => {
            const event = require(`.${directory}/${eventFile}`);

            try {
                if (event.once) {
                    this.once(event.name, (...args) => {
                        event.execute(this, ...args);
                    })
                } else {
                    this.on(event.name, (...args) => {
                        event.execute(this, ...args);
                    })
                }
                success++;
            } catch (error) {
                failure++;
            }

        });

        this.logger.console({
            level: `DEBUG`,
            title: `Initalized Event Handlers`,
            message: [
                `From (${directory}/)...`,
                `- ${success} events successfully loaded`,
                `- ${failure} events failed to load`
            ],
        });
    };

    /**
     * Registers all slash commands with the server
     * @param {Client} readyClient the initialized client (called from `ready` event)
     * @param {String} directory path to application commands structure files
     */
    registerSlashCommands(readyClient, directory) {
        // register slash commands (rewrite deploy.js)
        const slashCommandFiles = fs.readdirSync(directory);
        const commandStructures = [];
        let success = 0;

        slashCommandFiles.forEach(slashCommandFile => {
            const command = require(`.${directory}/${slashCommandFile}`);
            commandStructures.push(command);
            success++;
        });

        /** @depricated as global application commands are registered and available immediately */
        // const serverID = this.environment === `DEV` ? this.config.SERVER_ID.DEVELOPMENT : this.config.SERVER_ID.ONLINE_COLLEGE;
        // const serverID = this.config.SERVER_ID.ONLINE_COLLEGE;
        // readyClient.guilds.cache.get(serverID).commands.set(commandStructures);

        // globally register all application commands
        readyClient.application.commands.set(commandStructures);
        readyClient.application.commands.set([]);

        this.logger.console({
            level: `DEBUG`,
            title: `Registered Slash Commands`,
            message: [
                `From (${directory}/)...`,
                `- ${success} command(s) registered`
            ],
        });
    };

    /**
     * Load slash command files from specified directory
     * @param {String} directory
     */
    loadSlashCommands(directory) {
        /* TODO: Load Slash Commands
            - Log function start
            - Track successful & unsuccessful slash command loads
            - Offload file validation to getFilePath(dir, ext)?
        */
        // register all slash commands
        const slashCommandFiles = fs.readdirSync(directory);
        let success = 0;

        slashCommandFiles.forEach(slashCommandFile => {
            const slashCommand = require(`.${directory}/${slashCommandFile}`);
            this.slashCommands.set(slashCommand.name, slashCommand);
            success++;
        });

        this.logger.console({
            level: `DEBUG`,
            title: `Loaded Slash Commands`,
            message: [
                `From (${directory}/)...`,
                `- ${success} command(s) loaded`
            ],
        });
    };

    /**
     * Load button & button manager files from specified directory
     * @param {String} directory
     */
    loadButtons(directory) {
        /* TODO: Load Button Managers
            - Log function start
            - Track successful & unsuccessful button manager loads
            - Offload file validation to getFilePath(dir, ext)?
        */
        const buttonFiles = fs.readdirSync(directory);
        let success = 0;

        buttonFiles.forEach(buttonFile => {
            const button = require(`.${directory}/${buttonFile}`);
            this.buttons.set(button.id, button);
            success++;
        });

        this.logger.console({
            level: `DEBUG`,
            title: `Loaded Buttons & Button Managers`,
            message: [
                `From (${directory}/)...`,
                `- ${success} button/(manager)(s) loaded`
            ],
        });
    };

    /**
     * Load select menus from specified directory
     * @param {String} directory
     */
    loadSelectMenus(directory) {
        /* TODO: Load Select Menus
            - Log function start
            - Track successful & unsuccessful select menu loads
            - Offload file validation to getFilePath(dir, ext)?
        */
        const selectMenuFiles = fs.readdirSync(directory);
        let success = 0;

        selectMenuFiles.forEach(selectMenuFile => {
            const selectMenu = require(`.${directory}/${selectMenuFile}`);
            this.selectMenus.set(selectMenu.id, selectMenu);
            success++;
        });

        this.logger.console({
            level: `DEBUG`,
            title: `Loaded Select Menus`,
            message: [
                `From (${directory}/)...`,
                `- ${success} menu(s) loaded`
            ],
        });
    };

    /**
     * Log transcript based messages in correct channel
     * @param {String} type of transcript (support || modapp)
     * @param {Object} member subject of transcript
     * @param {Array} transcript transcript array
     */
    toTranscript(type, member, transcript) {

    };

    /** 
     * Generate emebed object
     * @param {Object} embedFields 
     * @returns {Object} 
     */
    embedCreate(embedFields) {
        // destructure embedFields object
        const { title, url, author, thumbnail, description, fields, color, footer, timestamp } = embedFields;
        /* embedFields object format
        {
            title : ``,
            author : { name : ``, url : ``, iconURL : `` },
            thumbnail : ``,
            description: ``,
            fields: [
                { name: ``, value: `` },
            ],
            color : ``,
            footer : { text: ``, iconURL: `` },
            timestamp : true,
        }
         */

        // blank array for missing data
        let missingFields = [];

        const embed = new MessageEmbed();
        if (title) { embed.setTitle(title); };
        if (url) { embed.setURL(url); };
        if (author) { embed.setAuthor(author); };
        if (thumbnail) { embed.setThumbnail(thumbnail); };
        description ? embed.setDescription(description) : missingFields.push(`Missing description field`);
        if (fields) { embed.addFields(...fields) }
        color ? embed.setColor(color) : missingFields.push(`Missing embed color`);
        if (footer) { embed.setFooter(footer); };
        if (timestamp) { embed.setTimestamp(); };

        if (missingFields.length !== 0) {
            this.logger.console({
                level: `WARNING`,
                title: `Missing embed fields`,
                message: missingFields,
            });
        }

        return embed;

    };
};
