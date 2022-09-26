const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require(`discord.js`);

module.exports = {

    name: `pingfd`,

    execute(interaction) {

        const ticketOptions = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('noManager')
                    .setLabel(`noManager`)
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('managed_button')
                    .setLabel(`managed_button`)
                    .setStyle('DANGER')
            )
        const yearRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('year')
                    .setPlaceholder('Year Selection')
                    .addOptions([
                        {
                            label: '🥚 - Incoming/Prospective',
                            description: 'Incoming/Prospective Student Role',
                            value: `0`,
                        },
                        {
                            label: '🎓 - Graduated',
                            description: 'Graduated Student Role',
                            value: `1`,
                        },
                        {
                            label: '👶 - Freshman',
                            description: 'Undergraduate Student Role',
                            value: `2`,
                        },
                        {
                            label: '💪 - Sophomore',
                            description: 'Undergraduate Student Role',
                            value: `3`,
                        },
                        {
                            label: '🧠 - Junior',
                            description: 'Undergraduate Student Role',
                            value: `4`,
                        },
                        {
                            label: '👑 - Senior/Senior+',
                            description: 'Undergraduate Student Role',
                            value: `5`,
                        },
                        {
                            label: '📝 - Masters Program',
                            description: 'Graduate Student Role',
                            value: `6`,
                        },
                        {
                            label: '🥼 - Graduate Program',
                            description: 'Graduate Student Role',
                            value: `7`,
                        }
                    ])
            )

        interaction.reply({ content: `pong`, embeds: [], components: [ticketOptions, yearRow], allowedMentions: { repliedUser: false } });
    }
};