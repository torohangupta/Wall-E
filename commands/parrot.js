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

        let str = '';
        for (let i = 1; i <= args.length; i++) {
            str += args[i - 1] + ' ';
        }
        message.channel.send(str.trim());
    },
};