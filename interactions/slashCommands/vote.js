const { MessageEmbed } = require('discord.js');
const { checkmark, crossmark } = require(`../../dependencies/resources/emojis.json`);

module.exports = {

    name: `vote`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const question = interaction.options._hoistedOptions[0].value;
        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        // create embed for poll
        var voteEmbed = new MessageEmbed()
            .setTitle(`New Poll:`)
            .setColor(`4F674F`)
            .setDescription(question)
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        // post embed for poll and react with check or cross
        interaction.reply({ embeds: [voteEmbed], allowedMentions: { repliedUser: false }, fetchReply: true}).then(pollEmbed => {
            pollEmbed.react(checkmark.emote)
            pollEmbed.react(crossmark.emote)
        })
    }
};