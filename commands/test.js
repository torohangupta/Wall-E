const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require("discord.js");
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
            // .setTitle(`🎓  |  Year Selection`)
            .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
            .setColor(`F1BE48`)
            .setFields(
                { name: `\u200B`, value: `\` ${a} \` 🥚 - Incoming/Prospective\n\` ${a} \` 🎓 - Graduated` },
                { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${a} \` 👶 - Freshman\n\` ${a} \` 💪 - Sophomore\n\` ${a} \` 🧠 - Junior\n\` ${a} \` 👑 - Senior/Senior+` },
                { name: `\u200B`, value: `__Graduate Program Roles__\n\` ${a} \` 📝 - Masters Program\n\` ${a} \` 🥼 - Graduate Program` },
                { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` }
            )

        const majorEmbed = new MessageEmbed()
            // .setTitle(`🎓  |  Major Selection`)
            .setDescription(`⬇️ Please select your major using the menu below! ⬇️`)
            .setColor(`E92929`)
            .setFields(
                { name: `\u200B`, value: `\` ${a} \` | \` AER E \` - ✈️ Aerospace Engineering \n\` ${a} \` | \` A B E \` - 🚜 Agricultural & Bio-Systems Engineering\n\` ${a} \` | \`  CH E \` - 🔬 Chemical Engineering\n\` ${a} \` | \`   C E \` - 🌉 Civil Engineering\n\n\` ${a} \` | \` CPR E \` - 💾 Computer Engineering\n\` ${a} \` | \` COM S \` - ⌨️ Computer Science\n\` ${a} \` | \` CON E \` - 🏗️ Construction Engineering\n\` ${a} \` | \` CYS E \` - 📡 Cybersecurity Engineering\n\n\` ${a} \` | \`    DS \` - 🖨️ Data Science\n\` ${a} \` | \`   E E \` - 💡 Electrical Engineering\n\` ${a} \` | \`   E M \` - 🛠️ Engineering Mechanics\n\` ${a} \` | \` ENV E \` - 🌿 Environmental Engineering\n\n\` ${a} \` | \`   I E \` - 🏭 Industrial Engineering\n\` ${a} \` | \` MAT E \` - 🧱 Materials Science & Engineering\n\` ${a} \` | \`   M E \` - ⚙️ Mechanical Engineering\n\` ${a} \` | \`   S E \` - 💻 Software Engineering` },
                { name: `\u200B`, value: `*Select your major(s) to gain access to the major-specific channels\nfor your program!*` }
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


        const majorRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('major')
                    .setPlaceholder('Major Selection')
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: '✈️ Aerospace Engineering',
                            description: 'College of Engineering',
                            value: '0',
                        },
                        {
                            label: '🚜 Agricultural & Bio-Systems Engineering',
                            description: 'College of Engineering',
                            value: '1',
                        },
                        {
                            label: '🔬 Chemical Engineering',
                            description: 'College of Engineering',
                            value: '2',
                        },
                        {
                            label: '🌉 Civil Engineering',
                            description: 'College of Engineering',
                            value: '3',
                        },
                        {
                            label: '💾 Computer Engineering',
                            description: 'College of Engineering',
                            value: '4',
                        },
                        {
                            label: '⌨️ Computer Science',
                            description: 'College of Liberal Arts & Sciences',
                            value: '5',
                        },
                        {
                            label: '🏗️ Construction Engineering',
                            description: 'College of Engineering',
                            value: '6',
                        },
                        {
                            label: '📡 Cybersecurity Engineering',
                            description: 'College of Engineering',
                            value: '7',
                        },
                        {
                            label: '🖨️ Data Science',
                            description: 'College of Liberal Arts & Sciences',
                            value: '8',
                        },
                        {
                            label: '💡 Electrical Engineering',
                            description: 'College of Engineering',
                            value: '9',
                        },
                        {
                            label: '🛠️ Engineering Mechanics',
                            description: 'College of Engineering',
                            value: '10',
                        },
                        {
                            label: '🌿 Environmental Engineering',
                            description: 'College of Engineering',
                            value: '11',
                        },
                        {
                            label: '🏭 Industrial Engineering',
                            description: 'College of Engineering',
                            value: '12',
                        },
                        {
                            label: '🧱 Materials Science & Engineering',
                            description: 'College of Engineering',
                            value: '13',
                        },
                        {
                            label: '⚙️ Mechanical Engineering',
                            description: 'College of Engineering',
                            value: '14',
                        },
                        {
                            label: '💻 Software Engineering',
                            description: 'College of Engineering',
                            value: '15',
                        }
                    ]),
            )

        const btn = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('btn')
                    .setLabel(`btn`)
                    .setStyle('DANGER')
            )
        message.delete();

        

        // for (let i = 0; i < time; i++) {
        //     console.log(i);

        // }


        time = 10000;

        message.channel.send(`Thanks for joining the server! <:checkmark:816695356384346133>\n⬇️ Here is a little **guide** on how to get started ⬇️\n\nThis discord has channels for classes in engineering offered at** Iowa State University**. The majors available on the server are below:\n> \`AER E\` - \`A B E\` - \`CH E\` - \`C E\` - \`CPR E\` - \`COM S\` - \`CON E\` - \`CYS E\` - \`DS\` - \`E E\` - \`E M\` - \`ENV E\` - \`I E\` - \`MAT E\` - \`M E\` - \`S E\`\n\n**To see all course channels on the server, check out** <#791063876828528640>\n\n**🔹STEP :one: - SELECT YOUR YEAR🔹**\n---------------------------------------------------\nAdd your year using the dropdown below!\n✨  *You'll get a role to show off your current year!*  ✨`).then(async msg => {
            await message.channel.send({ files: [`dependencies/imageAssets/year.png`] })
            await message.channel.send({ embeds: [yearEmbed], components: [yearRow] })
            await message.channel.send(`**🔹STEP :two: - SELECT YOUR MAJOR🔹**\n---------------------------------------------------\nJoin the discussion in channels related only to your program by picking out your major using the dropdown below!\n✨  *You'll get a role/roles to show off what you are studying!*  ✨`);
            await message.channel.send({ files: [`dependencies/imageAssets/majors.png`] })
            await message.channel.send({ embeds: [majorEmbed], components: [majorRow] })
            await message.channel.send(`**\🔹STEP \:three: - JOIN YOUR CLASSES\🔹**\n---------------------------------------------------\nGo to \<#789256304844603494> and use the \`/class\` command to join the class channels you want.\n\n\nHere are the commands to use \<@&863620864881066014>'s role management commands:\n> \`/class join <classid>      \`   \▶️   Join a class's channel\n> \`/class leave <classid>     \`   \▶️   Leave a class's channel\n> \`/class leave-all           \`   \▶️   Leave all of your class channels\n\n\n__Examples__:\n> \`/class join engr101 \`\n> \`/class leave lib160 \`\n> \`/class leave-all    \`\n\nDon't see your class? Create a support ticket in the \<#866434475495129118> channel or send a message in \<#818298262586785822>!\n\nEnjoying the server? Invite your friends \▶️ https://discord.gg/ecBCdrt\n\nStill confused 😕? Reach out to the mods using the \<#866434475495129118> channel and we'll be able to help you get started!`);
            await message.client.fetchWebhook(`984560789526548540`).then(w => {
                w.send({ content: `[Scroll to the top](${msg.url})` })
            })
        })

        // message.client.fetchWebhook(`984560789526548540`).then( w => {
        //     w.send({ content: `[top](https://discord.com/channels/692094440881520671/745088111179988994/984554220445368321)`})
        // }) // https://discord.com/api/webhooks/984560789526548540/cKKdeYw2GEEBIlcsJJT5xDMN1Kx7yXSdtegSErbkyGLwkPnP7j61dyIfqHRH-LNh8JhQ
    }
};