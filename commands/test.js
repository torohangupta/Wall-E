const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

module.exports = {

    name: `test`,
    aliases: [`t`],
    description: `test`,
    usage: `message`,
    requiredPermissions: ``,
    developerOnly: true,

    execute(message, args) {
        // fixed width spaces https://jkorpela.fi/chars/spaces.html

        a = `001`;
        const yearEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Year Selection`)
            .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
            .setFields(
                { name: `\u200B`, value: `\` ${a} \` 🥚 - Incoming/Prospective\n\` ${a} \` 🎓 - Graduated` },
                { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${a} \` 👶 - Freshman\n\` ${a} \` 💪 - Sophomore\n\` ${a} \` 🧠 - Junior\n\` ${a} \` 👑 - Senior/Senior+` },
                { name: `\u200B`, value: `__Graduate Program Roles__\n\` ${a} \` 📝 - Masters Program\n\` ${a} \` 🥼 - Graduate Program` },
                { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` },
            )

        const majorEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Major Selection`)

        const yearRow1 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('undergrad')
                    .setPlaceholder('Undergraduate Roles')
                    .addOptions([
                        {
                            label: '🥚 - Incoming/Prospective',
                            description: 'Incoming/Prospective Student Role',
                            value: `0`,
                        },
                        {
                            label: '👶 - Freshman',
                            description: 'Undergraduate Student Role',
                            value: `1`,
                        },
                        {
                            label: '💪 - Sophomore',
                            description: 'Undergraduate Student Role',
                            value: `2`,
                        },
                        {
                            label: '🧠 - Junior',
                            description: 'Undergraduate Student Role',
                            value: `3`,
                        },
                        {
                            label: '👑 - Senior/Senior+',
                            description: 'Undergraduate Student Role',
                            value: `4`,
                        }
                    ])
            )
        const yearRow2 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('grad-postgrad')
                    .setPlaceholder('Graduated/Graduate Program Roles')
                    .addOptions([
                        {
                            label: '🎓 - Graduated',
                            description: 'Graduated/Graduate Student Role',
                            value: `5`,
                        },
                        {
                            label: '📝 - Masters Program',
                            description: 'Graduated/Graduate Student Role',
                            value: `6`,
                        },
                        {
                            label: '🥼 - Graduate Program',
                            description: 'Graduated/Graduate Student Role',
                            value: `7`,
                        },
                    ]),
            )


        const majorRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select1')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            )

        message.channel.send({ embeds: [yearEmbed], components: [yearRow1, yearRow2] });
        message.channel.send({ embeds: [majorEmbed], components: [majorRow] });
    },
};