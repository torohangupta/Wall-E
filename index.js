const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, userIDs, consoleChannel } = require('./config.json');


const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));

// Indexes all the available commands from the ./commands filepath & stores in the commands array
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Sends "Ready!" to the console once the bot is online and ready
client.once('ready', () => {
    console.clear();
    console.log('Wall-E');
    client.user.setActivity('rohan write bad code', { type: 'WATCHING' })
});

// Command handling
client.on('message', message => {

    // if a message does not contain the prefix for the bot OR is from another bot, ignore the message
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // if the 
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Run user checks to ensure that the command author meets the criteria to pass the command
    if (command.developerOnly && message.author.id != userIDs.rohan) {
        return message.channel.send(`This is a developer only command.`)
    }

    // Check for tagegd user
    if (command.needsTaggedUser && !message.mentions.users.size) {
        return message.channel.send(`You need to tag someone in order to use this command!`)
    }

    // check for channel type
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.channel.send(`You need to be in a server to use this command!`);
    }
    
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
        console.log(`Running ${command.name}, requested by ${message.author}`)
        client.channels.cache.get(`768856507903115294`).send(`Running \`${command.name}\`, requested by \`${message.author.username}\``);

    } catch (error) { 
        console.error(error);
        message.channel.send('There was an error trying to execute that command.');
        message.channel.send(`\`\`\`${error}\`\`\``)
        client.channels.cache.get(`768856507903115294`).send(`There was an error trying to execute \`${command.name}\`, requested by \`${message.author.username}\``);
        client.channels.cache.get(`768856507903115294`).send(`\`\`\`${error}\`\`\``);
    }
});

// login to Discord with bot token
client.login(token);