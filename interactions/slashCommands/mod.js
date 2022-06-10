const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require(`discord.js`);
const { roleID } = require(`../../dependencies/resources/config.json`);

module.exports = {

    name: `mod`,

    async execute(interaction) {

        // mod & admin roles

        var message = ``;

        // other important stuff
        const userRoleIDs = interaction.member._roles;

        // restrict usage to mods
        if (!userRoleIDs.includes(roleID.mod)) {
            return interaction.reply({ content: `I'm sorry, only moderators can use this command!`, ephemeral: true });
        }


        const subCommand = interaction.options._subcommand;

        switch (subCommand) {
            case `offer-position`:
                if (userRoleIDs.includes(roleID.admin)) {
                    // if admin, try to find channel to offer role to
                    let guildMember = interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].value)
                    let usernameScrubbed = guildMember.user.username.toLowerCase().replace(/[^a-z]+/g, '');

                    const modappChannel = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`modapp-${usernameScrubbed}`)).map(c => c);

                    if (modappChannel.length == 0) {
                        return interaction.reply({ content: `That person does not have a mod application open! Please try again`, ephemeral: true });

                    } else {
                        // offer mod position
                        const modOfferEmbed = new MessageEmbed()
                            .setTitle(`Mod Offer`)
                            .setDescription(`Congratulations! You'be been offered the position! When you're ready to accept, click \`🔨 Accept the Role\`!`)
                            .setColor(`4b6999`)

                        const modRoleButton = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('modappAccept')
                                    .setLabel(`Accept the Role`)
                                    .setStyle('DANGER')
                                    .setEmoji(`🔨`)
                            )

                        modappChannel[0].send({ embeds: [modOfferEmbed], components: [modRoleButton] });

                        message = `Sent offer to ${guildMember} in \`#modapp-${usernameScrubbed}\``;
                    }

                } else {
                    return interaction.reply({ content: `Only admins can use this command.`, ephemeral: true });
                }
            case `channel-reset`:
                selection = interaction.options._hoistedOptions[0].value;

                switch (selection) {
                    case `getting-started`:
                        const chan = interaction.member.guild.channels.cache.get(`984572699173089290`);
                        channelClear(chan);

                        let a = `  1`;
                        const yearEmbed = new MessageEmbed()
                            // .setTitle(`🎓  |  Year Selection`)
                            .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
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

                        chan.send(`Welcome to the server & thank you for joining! <:checkmark:816695356384346133>`).then(async msg => {
                            await chan.send(`⬇️ Scroll down through the channel & follow the instructions to get started ⬇️\n\nThis Discord server has channels for engineering & computer science courses offered at** Iowa State University**.\n**To see all course channels on the server, check out** <#791063876828528640>\n\n**🔹STEP :one: - SELECT YOUR YEAR🔹**\n---------------------------------------------------\nAdd your year using the dropdown below!\n✨  *You'll get a role to show off your current year!*  ✨`)
                            await chan.send({ files: [`dependencies/imageAssets/year.png`] })
                            await chan.send({ embeds: [yearEmbed], components: [yearRow] })
                            await chan.send(`**🔹STEP :two: - SELECT YOUR MAJOR🔹**\n---------------------------------------------------\nJoin the discussion in channels for your program by picking out your major(s) using the dropdown below!\n✨  *You'll get a role/roles to show off what you are studying!*  ✨`);
                            await chan.send({ files: [`dependencies/imageAssets/majors.png`] })
                            await chan.send({ embeds: [majorEmbed], components: [majorRow] })
                            await chan.send(`**\🔹STEP \:three: - JOIN YOUR CLASSES\🔹**\n---------------------------------------------------\nGo to \<#789256304844603494> and use the \`/class\` command to join the class channels you want.\n\n\nHere is how to use \<@&863620864881066014>'s role management commands:\n> \` /class join <classid>      \`   \▶️   Join a class's channel\n> \` /class leave <classid>     \`   \▶️   Leave a class's channel\n> \` /class leave-all           \`   \▶️   Leave all of your class channels\n\n\n__Examples__:\n> \` /class join engr101 \`\n> \` /class leave lib160 \`\n> \` /class leave-all    \`\n\n❓ Don't see your class? Create a support ticket in the \<#866434475495129118> channel or send a message in \<#818298262586785822>!\n\n❤️ Enjoying the server? Invite your friends \▶️ https://discord.gg/ecBCdrt\n\n😕 Still confused? Reach out to the mods using the \<#866434475495129118> channel and we'll be able to help you get started!`);
                            await chan.client.fetchWebhook(`984560789526548540`).then(webhook => {
                                webhook.send({ content: `⏫ [Jump to the top](${msg.url}) ⏫` })
                            })
                        })
                        break;

                    default:

                        break;
                }
                message = `Channel reset!`;
        }

        // create reply embed
        const replyEmbed = new MessageEmbed()
            .setDescription(message)
            .setColor(`45ad80`)

        // reply to the interaction
        return interaction.reply({ embeds: [replyEmbed], allowedMentions: { repliedUser: false } });

        async function channelClear(channel) {
            const fetchedMessages = await channel.messages.fetch({ limit: 100 });
            return await channel.bulkDelete(fetchedMessages);
        }
    }
};