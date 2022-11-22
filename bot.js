require(`dotenv`).config();

const BotClient = require(`./core/botClient.js`);
const Logger = require(`./core/logger.js`)

console.clear();

// initialize client
const client = new BotClient(process.env.ENVIRONMENT);

// initialize logger & attach to new BotClient
const logger = new Logger();
client.logger = logger;

// catch uncaughtExceptions & warning events and log them to the console
process.on(`uncaughtException`, (err) => client.logger.console(`ERROR`, err.name, err.cause, err.stack));
process.on(`warning`, (warning) => client.logger.console(`WARNING`, warning.name, warning.stack));

client.logger.console(`DEBUG`, `Starting...`, `Initalized BotClient & attached Logger to the BotClient instance`);

client.loadSlashCommands(`./interactions/commands`);
client.loadButtons(`./interactions/buttons`);
// client.loadSelectMenus(/* dir */);
client.loadEvents(`./events`);

client.login(process.env.TOKEN);
client.logger.console(`DEBUG`, `Logging in with bot token...`);
