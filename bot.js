require(`dotenv`).config();

const BotClient = require(`./core/botClient.js`);
const Logger = require(`./core/logger.js`)

console.clear();

// initialize client
const client = new BotClient(process.env.ENVIRONMENT);

// initialize logger & attach to new BotClient
const logger = new Logger();
client.logger = logger;

// catch exceptions and log to console
process.on(`uncaughtException`, (err) => {
    client.logger.console({
        level: `ERROR`,
        title: err.name,
        message: err.cause,
        stack: err.stack,
    });
});

// catch warnings and log them to the console
process.on(`warning`, (warning) => {
    client.logger.console({
        level: `WARNING`,
        title: warning.name,
        stack: warning.stack,
    });
});

// start the bot
client.logger.console({
    level: `DEBUG`,
    title: `Starting...`,
    message: `Initalized BotClient & attached Logger to the BotClient instance`,
});

client.loadSlashCommands(`./interactions/commands`);
client.loadButtons(`./interactions/buttons`);
// client.loadSelectMenus(/* dir */);
client.loadEvents(`./events`);

client.login(process.env.TOKEN);
client.logger.console({
    level: `DEBUG`,
    title: `Logging in with bot token...`,
});
