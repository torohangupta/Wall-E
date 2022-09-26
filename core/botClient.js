const fs = require(`fs`);

const { Client, Collection, MessageEmbed } = require("discord.js");
const { } = require(`./logger.js`)

module.exports = class BotClient extends Client {
    constructor(environment) {
        super({
            intents: [`GUILDS`, `GUILD_MESSAGES`, `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `GUILD_MEMBERS`, `GUILD_PRESENCES`, `DIRECT_MESSAGES`],
            partials: ['CHANNEL'],
        });

        this.config = require(`./config.js`); // load the config file
        this.environment = environment; // environment bot is in (dev || live)

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

        // get event files & filter by .js files
        const eventFiles = fs.readdirSync(directory);
        let success = 0;
        let failure = 0;

        // turn on event handlers
        eventFiles.forEach(eventFile => {
            const event = require(`.${directory}/${eventFile}`);
            console.log(`.${directory}/${eventFile}`);
            // console.log(event)

            try {
                if (event.once) {
                    this.once(event.name, (...args) => {
                        event.execute(this, ...args)
                    })
                } else {
                    this.on(event.name, (...args) => {
                        event.execute(this, ...args)
                    })
                }
                success++;
            } catch (error) {
                failure++;
                console.log(`failure`)
            }

        });

        console.log(`LOG: ${success} events successfully loaded, ${failure} events failed to load.`)
    }

    /**
     * Registers all slash commands with the server
     * @param {String} directory
     */
    registerSlashCommands(readyClient, directory) {
        // register slash commands (rewrite deploy.js)
        const slashCommandFiles = fs.readdirSync(directory);
        const commandStructures = [];

        slashCommandFiles.forEach(slashCommandFile => {
            const command = require(`.${directory}/${slashCommandFile}`);
            commandStructures.push(command);
        });

        // get server ID to register commands to (DEV || OC)
        const serverID = this.environment === `DEV` ? this.config.SERVER_ID.DEVELOPMENT : this.config.SERVER_ID.ONLINE_COLLEGE;

        // console.log(this)
        // this.commands.set(commandStructures)

        readyClient.guilds.cache.get(serverID).commands.set(commandStructures);
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
        // register all slash commands
        const slashCommandFiles = fs.readdirSync(directory);

        slashCommandFiles.forEach(slashCommandFile => {
            const slashCommand = require(`.${directory}/${slashCommandFile}`);
            this.slashCommands.set(slashCommand.name, slashCommand)
        });
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

    logger(logLevel, title, message) {

    }

    /** 
     * Generate emebed object
     * @param {Object} embedFields
     * @returns {Object} 
     */
    embedGenerator(embedFields) {
        const embed = new MessageEmbed();

        if (embedFields.title) { embed.setTitle(embedFields.title) };


        return embed

    }
};
