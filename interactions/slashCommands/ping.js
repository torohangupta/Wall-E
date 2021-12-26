const { MessageEmbed } = require(`discord.js`);

module.exports = {

    name: `ping`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        const pingEmbed = new MessageEmbed()
            .setTitle(`🏓 Pong!`)
            .setColor(`ABD1C9`)
            .setDescription(`Client Ping: ${Date.now() - interaction.createdTimestamp}ms.\nAPI Latency: ${interaction.client.ws.ping}ms`)
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        interaction.reply({ embeds: [pingEmbed], allowedMentions: { repliedUser: false } });
    }
};