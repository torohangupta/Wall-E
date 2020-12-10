const { MessageEmbed } = require("discord.js");

module.exports = {

    name: `poll`,
    aliases: [`poll`],
    description: `Creates a poll for members to vote via reactions`,
    usage: `[question]`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // get nickname, if user doesn't have a set nickname, return username
        if (!message.member.nickname) {
            uName = message.author.username;

        } else {
            uName = message.member.nickname;

        }

        // Delete a message
        message.delete()
            .then(msg => console.log(`Deleted '${message}' from ${msg.author.username}`))
            .catch(console.error);

        let str = '';
        for (let i = 1; i <= args.length; i++) {
            str += args[i - 1] + ' ';
        }

        var pollmsg = str.trim();

        var pollEmbed = new MessageEmbed()
            .setTitle(`New Poll:`)
            .setDescription(`\u200B`)
            .setColor(`4F674F`)
            .addFields(
                { name: pollmsg, value: `\u200B` }
            )
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send(pollEmbed).then(m => {
            m.react('✅')
            m.react('❌')
        })

    },
};