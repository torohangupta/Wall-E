const fs = require('fs');
const Discord = require('discord.js');
const { userID, walle } = require('./dependencies/resources/config.json');
const { permsChecker, logCommandRun, logCommandError, recievedDM } = require(`./dependencies/runtime.js`);

const prefix = `~`;

fs.readdirSync(`./`).includes(`.env`) ? require("dotenv").config() : ``;

// create new discord client with proper intents
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `GUILD_MEMBERS`, `DIRECT_MESSAGES`, `GUILD_PRESENCES`], partials: ['CHANNEL'] });
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selectMenus = new Discord.Collection();


// load all automod filter files
const automod = require(`./dependencies/automod.js`);



// load all commands
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// load all events
const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith(`.js`));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event.once ? client.once(event.name, (...args) => event.execute(...args, client)) : client.on(event.name, (...args) => event.execute(...args, client));
}

// register all slash commands
const slashCommandsList = fs.readdirSync(`./interactions/slashCommands`).filter(file => file.endsWith('.js'));
for (const file of slashCommandsList) {
    const slashcommand = require(`./interactions/slashCommands/${file}`);
    client.slashCommands.set(slashcommand.name, slashcommand)
}

// register all buttons
const buttonFiles = fs.readdirSync(`./interactions/buttons`).filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
    const button = require(`./interactions/buttons/${file}`);
    client.buttons.set(button.id, button)
}

// register all select menus
const selectMenuFiles = fs.readdirSync(`./interactions/selectMenus`).filter(file => file.endsWith('.js'));
for (const file of selectMenuFiles) {
    const selectMenu = require(`./interactions/selectMenus/${file}`);
    client.selectMenus.set(selectMenu.id, selectMenu)
}

// TODO: remove all text based commands

// Command handling
client.on('messageCreate', message => {
    if (message.author.bot) return;

    // run every message though automod
    try {
        automod.execute(message);
    } catch (error) {
        console.log(`[ERROR] automod.js: ${error}`);
    }
    
    // logs any DM that is sent to Wall-E that isn't a command
    if (message.channel.type === 'DM' && !message.content.startsWith(prefix) && message.author.id != walle.id) {
        return recievedDM(message);
    }

    // if a message does not contain the prefix for the bot OR is from another bot, ignore the message
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    // if the message is a command, remove the prefix & split messaage by spaces & store in args. shifts all index values down and stores zeroth in commandName
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check all command names & aliases for commandName & stop if message isn't a command
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // check to make sure that the user has all the required permissions
    if (!permsChecker(command, message, args)) return;

    // execute the text command (depercated)
    try {
        command.execute(message, args);
        logCommandRun(client, command, message);
    
    } catch (error) {
        console.log(`[ERROR] messageCreate event error: ${error}`);
        console.error(error);
        logCommandError(client, command, message, error);
    }

});

// interaction handler (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const slashCommand = client.slashCommands.get(interaction.commandName);

    if (!slashCommand) {
        interaction.reply({ content: `That doesn't work currently. If you think this is a mistake, please submit a bug report on my GitHub!\nhttps://github.com/torohangupta/Wall-E`, ephemeral: true });
        return console.log(`${interaction.member.user.username} used a broken slash command!`);
    }

    try {
        await slashCommand.execute(interaction);
    } catch (error) {
        console.log(`[ERROR] interactionCreate event error: ${error}`);
        console.error(error);
    }
});

// interaction handler (buttons)
client.on('interactionCreate', async interaction => {
    // if the interaction is not a button press, ignore the event, otherwise log the user who triggered the event and preform the event action(s)
    if (!interaction.isButton()) return;
    console.log(`${interaction.member.user.username} pressed ${interaction.customId}!`)
    // console.log(client.buttons)

    const buttonPress = client.buttons.get(interaction.customId);
    if (!buttonPress) {
        interaction.reply({ content: `This feature is still a work in progress! If you want to check out what else is coming, check out my GitHub Repository at the link below!\nhttps://github.com/torohangupta/Wall-E`, ephemeral: true });
        return console.log(`${interaction.member.user.username} pressed a broken button!`);
    }

    // preform the button action(s)
    try {
        await buttonPress.execute(interaction);
    } catch (error) {
        console.log(`[ERROR] interactionCreate event error: ${error}`);
        console.error(error);
    }
});

// interaction handler (select menus)
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    const selectMenuInteraction = client.selectMenus.get(interaction.customId);
    await selectMenuInteraction.execute(interaction);
    // console.log(interaction)
});

// login to Discord with bot token
client.login(process.env.TOKEN);