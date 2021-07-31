const { MessageEmbed } = require("discord.js");
const { checkmark, crossmark } = require(`../dependencies/resources/emojis.json`);

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

        // create embed for poll
        var pollEmbed = new MessageEmbed()
            .setTitle(`New Poll:`)
            .setColor(`4F674F`)
            .setDescription(args.join(` `))
            .setTimestamp()
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // post embed for poll and react with check or cross
        message.reply({embeds: [pollEmbed], allowedMentions: { repliedUser: false }}).then(m => {
            m.react(checkmark.emote)
            m.react(crossmark.emote)
        })
    },
};