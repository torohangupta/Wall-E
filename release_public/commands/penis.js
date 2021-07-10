const { userIDs } = require(`../resources/config.json`);

module.exports = {

    name: `penis`,
    aliases: [`penis`, `dick`],
    description: `Using an expert algorithm, Wall-E determines the current length of your penis.`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {
        if (message.author.id == userIDs.rohan) {
            return message.channel.send(`Your penis is far too long to show`)
        } else {

            var size = Math.floor(Math.random() * 20 + 1);

            let penis = '8';
            for (i = 0; i <= size; i++) {
                penis += '=';
            }
            penis += 'D';

            message.channel.send(`Your penis size is:\n${penis}`)
        }
    },
};