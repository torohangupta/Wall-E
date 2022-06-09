const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
// const majorImage = `../dependencies/imageAssets/majors.png`;
// const yearImage = require("../../assets/images/year.png");

module.exports = {

    name: `test`,
    aliases: [`t`],
    description: `test`,
    usage: `message`,
    requiredPermissions: ``,
    developerOnly: true,

    execute(message, args) {
        // fixed width spaces https://jkorpela.fi/chars/spaces.html

        a = `  1`;
        const yearEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Year Selection`)
            .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
            .setFields(
                { name: `\u200B`, value: `\` ${a} \` 🥚 - Incoming/Prospective\n\` ${a} \` 🎓 - Graduated` },
                { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${a} \` 👶 - Freshman\n\` ${a} \` 💪 - Sophomore\n\` ${a} \` 🧠 - Junior\n\` ${a} \` 👑 - Senior/Senior+` },
                { name: `\u200B`, value: `__Graduate Program Roles__\n\` ${a} \` 📝 - Masters Program\n\` ${a} \` 🥼 - Graduate Program` },
                { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` }
            )

        const majorEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Major Selection`)
            .setDescription(`⬇️ Please select your major using the menu below! ⬇️`)
            .setFields(
                { name: `\u200B`, value: `\` ${a} \` | \` AER E \` - ✈️ Aerospace Engineering\n\` ${a} \` | \` A B E \` - 🚜 Agricultural & Bio-Systems Engineering\n\` ${a} \` | \` CON E \` - 🏗️ Construction Engineering\n\` ${a} \` | \`   C E \` - 🌉 Civil Engineering\n\` ${a} \` | \`   E E \` - 💡 Electrical Engineering\n\n\` ${a} \` | \`   E M \` - 🛠️ Engineering Mechanics\n\` ${a} \` | \`   I E \` - 🏭 Industrial Engineering\n\` ${a} \` | \` MAT E \` - 🧱 Materials Science & Engineering\n\` ${a} \` | \`   M E \` - ⚙️ Mechanical Engineering\n\` ${a} \` | \`  CH E \` - 🔬 Chemical Engineering\n\n\` ${a} \` | \` COM S \` - ⌨️ Computer Science\n\` ${a} \` | \` CPR E \` - 💾 Computer Engineering\n\` ${a} \` | \`   S E \` - 💻 Software Engineering\n\` ${a} \` | \` CYS E \` - 📡 Cybersecurity Engineering\n\` ${a} \` | \`    DS \` - 🖨️ Data Science` },
                { name: `\u200B`, value: `*Don't see your major? Create a support ticket using the* \<#866434475495129118> *channel and the mod team will be able to help you out!*` }
            )

        const yearRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('year')
                    .setPlaceholder('Year Selection')
                    .addOptions([
                        {
                            label: '` - I coming/Prospective',
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

        message.delete();
        // message.channel.send({ embeds: [yearEmbed], components: [yearRow] });
        message.channel.send({ embeds: [majorEmbed], components: [majorRow], files: [`dependencies/imageAssets/majors.png`] });
    },
};