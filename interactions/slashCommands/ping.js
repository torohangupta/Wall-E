const { MessageEmbed } = require(`discord.js`);
const { consoleChannel, updatesChannel } = require(`../../dependencies/resources/config.json`);

module.exports = {

    name: `ping`,
    whitelistedChannels: [``],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        // if the command is in #class-commands, return eith error
        if (interaction.channel.id == `789256304844603494`) {
            return interaction.reply({ content: `You can't use that command here!`, ephemeral: true });
        }


        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        const pingEmbed = new MessageEmbed()
            .setAuthor('Wall-E Ping Command', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
            .setTitle(`🏓 Pong!`)
            .setColor(`ABD1C9`)
            .setDescription(`Client Ping: ${Date.now() - interaction.createdTimestamp}ms.\nAPI Latency: ${interaction.client.ws.ping}ms`)
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        interaction.reply({ embeds: [pingEmbed], allowedMentions: { repliedUser: false } });
    }
};