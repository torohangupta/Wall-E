require("dotenv").config();

const BotClient = require(`./core/botClient.js`);

console.clear();

// initialize client
const client = new BotClient(process.env.ENVIRONMENT);


client.loadSlashCommands(`./interactions/commands`);
// client.loadButtonManagers(/* dir */);
// client.loadSelectMenus(/* dir */);
client.loadEvents(`./events`);

client.login(process.env.TOKEN);