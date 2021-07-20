const { consoleChannel, dmChannel, userIDs } = require(`../resources/config.json`);

function permsChecker(command, message, args) {
    // Run user checks to ensure that the command author meets the criteria to pass the command
    if (command.developerOnly && message.author.id != userIDs.rohan) {
        message.channel.send(`This is a developer only command.`);
        return false;
    }
    // Check for tagegd user
    if (command.needsTaggedUser && !message.mentions.users.size) {
        message.channel.send(`You need to tag someone in order to use this command!`);
        return false;
    }

    // check for channel type
    if (command.guildOnly && message.channel.type === 'dm') {
        message.channel.send(`You need to be in a server to use this command!`);
        return false;
    }

    // check to make sure the message has arguments if the command requires it
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    return true;
}

function logCommandRun(client, command, message) {
    console.log(`Running ${command.name}, requested by ${message.author}`)
    client.channels.cache.get(consoleChannel).send(`**Wall-E - Command Run**\n\`\`\`\nUser: ${message.author.username}\nGuild: ${message.member.guild.name}\nChannel: ${message.channel.name}\n\nCommand: ${command.name}\nMessage Content: ${message}\n\`\`\``);
    return;
}

function logCommandError(client, command, message, error) {
    message.channel.send(`There was an error trying to execute that command.\n\`\`\`${error}\`\`\``);
    client.channels.cache.get(consoleChannel).send(`There was an error trying to execute \`${command.name}\`, requested by \`${message.author.username}\`\n\`\`\`${error}\`\`\``);
    return;
}

function recievedDM(message) {
    message.client.channels.cache.get(dmChannel).send(`${message.author.username} just sent a DM: ${message}`);
    return;
}

module.exports = { permsChecker, logCommandRun, logCommandError, recievedDM }