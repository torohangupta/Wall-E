module.exports = {

    name: `move`,
    aliases: [`move`],
    description: `Moves user to a private voice channel`,
    usage: `password`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // Delete the message w/password
        message.delete()
            .then(msg => console.log(`Deleted '${message}' from ${msg.author.username}`))
            .catch(console.error);

        // message.channel.send(`${message.member.voice.channel}`)
        // if password is correct, move member to private VC
        if (args == 'password') {
            message.member.voice.setChannel(`750834618126696538`)
                .then(() => console.log(`Moved ${message.member.displayName} to ${message.member.voice.channel.name}`))
                .then(message.author.send(`Joining \`${message.member.voice.channel.name}\` with password: ${args}`))
                .catch(console.error);
        }
    },
};