const fs = require(`fs`);

module.exports = {

    name: `deploy`,
    aliases: [`deploy`],
    description: `Deploy all local slash commands`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: true,

    execute(message, args) {
        // create blank array for commands
        let commands = []

        const slash_commands = fs.readdirSync(`./interactions/slashCommands`).filter(file => file.endsWith(`.json`))

        for (file of slash_commands) {
            commands.push(require(`../interactions/slashCommands/${file}`));
        }

        message.client.guilds.cache.get(`692094440881520671`).commands.set(commands);
        message.channel.send(`Commands deployed.`)
    },
};