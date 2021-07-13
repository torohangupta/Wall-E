module.exports = {

    name: `parrot`,
    aliases: [`parrot`, `mimic`, `rpt`, `say`],
    description: `Repeats the arguments as a message`,
    usage: `message`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: true,


    execute(message, args) {

        // Delete the passed command
        message.delete()
            .then(msg => console.log(`Deleted '${message}' from ${msg.author.username}`))
            .catch(console.error);

        message.channel.send(args.join(` `));
    },
};