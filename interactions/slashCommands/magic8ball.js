const { MessageEmbed } = require(`discord.js`);
const { magic8responses } = require(`../../dependencies/resources/8ball.json`);

module.exports = {

    name: `magic8ball`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const question = interaction.options._hoistedOptions[0].value;
        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        // Generate random length
        var choice = Math.floor(Math.random() * magic8responses.length);

        // generate embed with response
        const magic8BallEmbed = new MessageEmbed()
            .setTitle(`🎱 | ${question}`)
            .setColor(`00539C`)
            .addFields(
                { name: `\u200B`, value: `\`\`\`${magic8responses[choice]}.\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))


        interaction.reply({ embeds: [magic8BallEmbed], allowedMentions: { repliedUser: false } });
    }
};