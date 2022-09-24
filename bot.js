require("dotenv").config();

const BotClient = require(`./core/botClient.js`);

// initialize client
const client = new BotClient();


// client.registerSlashCommands(/* dir */)
// client.loadCommands(/* dir */);
// client.loadButtonManagers(/* dir */);
// client.loadSelectMenus(/* dir */);
client.loadEvents(`./events`);

client.login(process.env.TOKEN);