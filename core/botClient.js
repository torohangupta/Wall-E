const fs = require(`fs`);

const { Client, Collection, MessageEmbed } = require("discord.js");

module.exports = class BotClient extends Client {
    constructor(environment) {
        super({
            intents: [`GUILDS`, `GUILD_MESSAGES`, `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `GUILD_MEMBERS`, `GUILD_PRESENCES`, `DIRECT_MESSAGES`],
            partials: ['CHANNEL'],
        });

        this.config = require(`./config.js`); // load the config file
        this.environment = environment; // environment bot is in (dev || live)

        /** @type {Collection} - slash commands collection */
        this.slashCommands = new Collection();

        /** @type {Collection} - select menus collection */
        this.selectMenus = new Collection();

        /** @type {Collection} - button manager collection */
        this.buttons = new Collection();

        /** @member {Class} logger instanciated by ready.js  */
        this.logger;
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
            }

        });

        this.logger.console(`DEBUG`, `Initalized Event Handlers`, [`From (${directory}/)...`, `- ${success} events successfully loaded`, `- ${failure} events failed to load`]);
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

        readyClient.guilds.cache.get(serverID).commands.set(commandStructures);

        this.logger.console(`DEBUG`, `Registered Slash Commands`, [`From (${directory}/)...`, `- ${success} command(s) registered`]);
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
        let success = 0;

        slashCommandFiles.forEach(slashCommandFile => {
            const slashCommand = require(`.${directory}/${slashCommandFile}`);
            this.slashCommands.set(slashCommand.name, slashCommand);
            success++;
        });

        this.logger.console(`DEBUG`, `Loaded Slash Commands`, [`From (${directory}/)...`, `- ${success} command(s) loaded`]);
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
