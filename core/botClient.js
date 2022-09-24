const { Client, Collection } = require("discord.js");

module.exports = class BotClient extends Client {
    constructor() {
        super({
            intents: [`GUILDS`, `GUILD_MESSAGES`, `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `GUILD_MEMBERS`, `GUILD_PRESENCES`, `DIRECT_MESSAGES`],
            partials: ['CHANNEL'],
        });

        this.config = require(`./config.js`); // load the config file

        /** @type {interactionSlash} - slash commands collection */
        this.slashCommands = new Collection();

        /** @type {interactionSelectMenu} - select menus collection */
        this.selectMenus = new Collection();

        /** @type {interactionButtonManager} - button manager collection */
        this.buttons = new Collection();

    }

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
    }

    /**
     * Registers all slash commands with the server
     * @param {String} directory
     */
    registerSlashCommands(directory) {
        // register slash commands (rewrite deploy.js)
    }

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
    }

    /**
     * Load button managers from specified directory
     * @param {String} directory
     */
    loadButtonManagers(directory) {
        /* TODO: Load Button Managers
            - Log function start
            - Track successful & unsuccessful button manager loads
            - Offload file validation to getFilePath(dir, ext)?
        */
    }

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
    }

};
