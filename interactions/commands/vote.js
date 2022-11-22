module.exports = {

    name: `vote`,

    execute(client, interaction) {
        const { CHECKMARK, CROSSMARK } = client.emotes;

        const question = interaction.options._hoistedOptions[0].value;
        const guildMember = interaction.guild.members.cache.get(interaction.member.id);
        const userName = guildMember.nickname ? guildMember.nickname : guildMember.user.username;

        const voteEmbed = client.embedCreate({
            author : { name : question },
            color : `4F674F`,
            footer : { text: `Asked by: ${userName}`, iconURL: guildMember.user.displayAvatarURL({ format: "png", dynamic: true }) },
            timestamp : true,
        });
        

        // post embed for poll and react with check or cross
        interaction.reply({ embeds: [voteEmbed], allowedMentions: { repliedUser: false }, fetchReply: true}).then(pollEmbed => {
            pollEmbed.react(CHECKMARK)
            pollEmbed.react(CROSSMARK)
        })
    }
};