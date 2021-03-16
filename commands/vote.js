const { upvote, downvote } = require(`../resources/emojis.json`)

module.exports = {

    name: `vote`,
    aliases: [`vote`, `v`],
    description: `Add upvotes & downvotes to a message.`,
    usage: `message-id`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {
        try {
            message.channel.messages.fetch(args[0])
                .then(m => {
                    m.react(upvote.id)
                    m.react(downvote.id)
                }).catch(console.error);
                message.delete();
        } catch {
            message.channel.send("There was an error!")
        }
    },
};