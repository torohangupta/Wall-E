require("dotenv").config();

const { BotClient } = require(`./core/botClient`);

// initialize client
const client = new BotClient();

async () => {
    await client.registerSlashCommands(/* dir */)
    await client.loadCommands(/* dir */);
    await client.loadButtonManagers(/* dir */);
    await client.loadSelectMenus(/* dir */);
    client.loadEvents(/* dir */);
};


client.login(process.env.BOT_TOKEN);