module.exports = {

    name: `about`,

    execute(client, interaction) {
        const config = client.config;
        const embed = client.embedCreate({
            title: `About Wall-E`,
            author: { name: `Wall-E`, url: config.GITHUB, iconURL: config.IMAGE.SQUARE },
            thumbnail: config.IMAGE.SQUARE,
            description: `Wall-E serves as the primary server management tool to manage Online College. A personal passion project, Wall-E manages the ticketing system, dynamic voice channels, moderator applications, automoderation & assignment of year & major roles.`,
            color: config.EMBED_COLORS.BOT_EMBED,
            footer: { text: `Wall-E`, iconURL: config.IMAGE.SQUARE },
            timestamp: true,
        })

        interaction.reply({ embeds: [embed] });
    }
};