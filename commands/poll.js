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
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Delete a message
        message.delete()
            .then(msg => console.log(`Deleted '${message}' from ${msg.author.username}`))
            .catch(console.error);

        let str = '';
        for (let i = 1; i <= args.length; i++) {
            str += args[i - 1] + ' ';
        }

        var pollmsg = str.trim();

        // create embed for poll
        var pollEmbed = new MessageEmbed()
            .setTitle(`New Poll:`)
            .setColor(`4F674F`)
            .addFields(
                { name: `\u200B`, value: pollmsg }
            )
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // post embed for poll and react with check or cross
        message.channel.send(pollEmbed).then(m => {
            m.react(`<:checkmark:798610690968387614>`)
            m.react(`<:crossmark:798610690968387685>`)
        })
    },
};