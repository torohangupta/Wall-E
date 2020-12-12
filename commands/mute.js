const { MessageEmbed } = require("discord.js");

module.exports = {

    name: `mute`,
    aliases: [`mute`, `m`],
    description: `Mutes a tagged user with options to unmute`,
    usage: `@[user]`,
    requiredPermissions: `MUTE_MEMBERS`,

    args: false,
    needsTaggedUser: true,
    needsPermissions: true,
    guildOnly: true,
    developerOnly: false,

    execute(message) {

        // check to make sure user has permission to mute members in the channel
        if(!message.member.hasPermission(`MUTE_MEMBERS`)) { message.channel.send(`You don't have permission to use this command`); return; } 

        // Check to make sure user is in a voice channel
        if (!message.member.voice.channel) { message.channel.send(`You must be in a voice channel to mute someone.`); return; }
        
        // get all tagged users from a message & store in taggedUsers
        const taggedUsers = message.mentions.users.map(u => u)

        // for each user in the voice channel, make sure that only those that are both tagged & are in the same VC are muted
        message.member.voice.channel.members.forEach(function (guildMember) {
            taggedUsers.forEach(taggedUser => {

                // if the tagged user is not a user in the VC, ignore the tag
                if (!taggedUser.equals(guildMember.user)) return;

                // create the muted embed
                const mutedEmbed = new MessageEmbed()
                .setAuthor(`Mute`, `https://i.imgur.com/xKFHs5U.png`)
                    .setDescription(`${taggedUser}, you have been muted by a server admin.\n\nThis may be because you forgot to mute yourself or your mic is having issues.\n\nReact with the 🔈 emote to be unmuted. If that doesn't work, ping the person who muted you.`)
                    .setColor(`B1624E`)
                    .setTimestamp(Date.now())

                // create the unmute embed
                const unmutedEmbed = new MessageEmbed()
                    .setDescription(`${taggedUser} has been unmuted!`)
                    .setColor(`006E33`)

                // mute the tagged user(s), send the muted embed message, create a reaction collector & react to the message
                message.channel.send(mutedEmbed).then(unmuteMsg => {
                    unmuteMsg.react(`🔈`)

                    // mute the tagged user(s)
                    guildMember.voice.setMute(true)

                    // create & turn on the reaction collector
                    const unmuteCollector = unmuteMsg.createReactionCollector((reaction, reactionUser) => { return reaction.emoji.name == '🔈' && reactionUser.id == taggedUser.id });
                    unmuteCollector.on('collect', () => {

                        // remove all reaction from the embed, edit the embed & unmute the tagged user(s)
                        unmuteMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        unmuteMsg.edit(unmutedEmbed)
                        guildMember.voice.setMute(false)

                    });
                })
            })
        })
    },
};