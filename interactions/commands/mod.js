const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = {

    name: `mod`,

    execute(client, interaction) {

        if (!interaction.member._roles.includes(client.config.ROLES.MOD)) {
            return interaction.reply({ content: `You must be a moderator to use this command.`, ephemeral: true });
        }

        interaction.reply({ content: `mod`, allowedMentions: { repliedUser: false } });


        const subCommand = interaction.options._subcommand;
        console.log(subCommand);

        switch (subCommand) {
            case `channel-reset`:
                const arg = interaction.options._hoistedOptions[0].value;
                channelReset(client, interaction, arg);
                break;
            case `toggle-modapps`:

                break
        }
    }
};

async function channelReset(client, interaction, arg) {
    let channelID;
    let channel;

    switch (arg) {
        case `getting-started`:

            // get channel ID, fetch channel object & then delete all the messages in the channel
            channelID = client.config.CHANNELS.GETTING_STARTED;
            // channel = interaction.member.guild.channels.cache.get(channelID);
            channel = interaction.channel;
            // clearChannelMessages(channel)

            // create a temp var
            const temp = `---`

            // create the year selection embed
            const yearEmbed = client.embedCreate({
                description: `⬇️ Please select your year using the menu below! ⬇️`,
                fields: [
                    { name: `\u200B`, value: `\` ${temp} \` 🥚 - Incoming/Prospective\n\` ${temp} \` 🎓 - Graduated` },
                    { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${temp} \` 👶 - Freshman\n\` ${temp} \` 💪 - Sophomore\n\` ${temp} \` 🧠 - Junior\n\` ${temp} \` 👑 - Senior/Senior+` },
                    { name: `\u200B`, value: `__Graduate Program Roles__\n\` ${temp} \` 📝 - Masters Program\n\` ${temp} \` 🥼 - Graduate Program` },
                    { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` }
                ],
                color: `F1BE48`,
            });

            // create output in array for easier readibility. \n seperates the groups of 4 options
            const messageArr = [
                `\` ${majorRoleMemberCount[0]} \` | \` AER E \` - ✈️ Aerospace Engineering`,
                `\` ${majorRoleMemberCount[1]} \` | \` A B E \` - 🚜 Agricultural & Bio-Systems Engineering`,
                `\` ${majorRoleMemberCount[2]} \` | \`  CH E \` - 🔬 Chemical Engineering`,
                `\` ${majorRoleMemberCount[3]} \` | \`   C E \` - 🌉 Civil Engineering`,
                `\n`,
                `\` ${majorRoleMemberCount[4]} \` | \` CPR E \` - 💾 Computer Engineering`,
                `\` ${majorRoleMemberCount[5]} \` | \` COM S \` - ⌨️ Computer Science`,
                `\` ${majorRoleMemberCount[6]} \` | \` CON E \` - 🏗️ Construction Engineering`,
                `\` ${majorRoleMemberCount[7]} \` | \` CYS E \` - 📡 Cybersecurity Engineering`,
                `\n`,
                `\` ${majorRoleMemberCount[8]} \` | \`    DS \` - 🖨️ Data Science`,
                `\` ${majorRoleMemberCount[9]} \` | \`   E E \` - 💡 Electrical Engineering`,
                `\` ${majorRoleMemberCount[10]} \` | \`   E M \` - 🛠️ Engineering Mechanics`,
                `\` ${majorRoleMemberCount[11]} \` | \` ENV E \` - 🌿 Environmental Engineering`,
                `\n`,
                `\` ${majorRoleMemberCount[12]} \` | \`   I E \` - 🏭 Industrial Engineering`,
                `\` ${majorRoleMemberCount[13]} \` | \` MAT E \` - 🧱 Materials Science & Engineering`,
                `\` ${majorRoleMemberCount[14]} \` | \`   M E \` - ⚙️ Mechanical Engineering`,
                `\` ${majorRoleMemberCount[15]} \` | \`   S E \` - 💻 Software Engineering`,
            ]

            // create the major selection embed
            const majorEmbed = client.embedCreate({
                description: `⬇️ Please select your major using the menu below! ⬇️`,
                fields: [
                    { name: `\u200B`, value: messageArr.join(`\n`) },
                    { name: `\u200B`, value: `*Select your major(s) to gain access to the major-specific channels\nfor your program!*` }
                ],
                color: `E92929`,
            });

            // create the major select menu
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

            // create the year select menu
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

            await channel.send(`Welcome to the server & thank you for joining! <:checkmark:816695356384346133>`).then(async msg => {
                await channel.send(`⬇️ Scroll down through the channel & follow the instructions to get started ⬇️\n\nThis Discord server has channels for engineering & computer science courses offered at** Iowa State University**.\n**To see all course channels on the server, check out** <#791063876828528640>\n\n**🔹STEP :one: - SELECT YOUR YEAR🔹**\n---------------------------------------------------\nAdd your year using the dropdown below!\n✨  *You'll get a role to show off your current year!*  ✨`)
                await channel.send({ files: [`utils/images/year.png`] })
                await channel.send({ embeds: [yearEmbed], components: [yearRow] })
                await channel.send(`**🔹STEP :two: - SELECT YOUR MAJOR🔹**\n---------------------------------------------------\nJoin the discussion in channels for your program by picking out your major(s) using the dropdown below!\n✨  *You'll get a role/roles to show off what you are studying!*  ✨`);
                await channel.send({ files: [`utils/images/majors.png`] })
                await channel.send({ embeds: [majorEmbed], components: [majorRow] })
                await channel.send(`**\🔹STEP \:three: - JOIN YOUR CLASSES\🔹**\n---------------------------------------------------\nGo to \<#789256304844603494> and use the \`/class\` command to join the class channels you want.\n\n\nHere is how to use \<@&863620864881066014>'s role management commands:\n> \` /class join <classid>      \`   \▶️   Join a class's channel\n> \` /class leave <classid>     \`   \▶️   Leave a class's channel\n> \` /class leave-all           \`   \▶️   Leave all of your class channels\n\n\n__Examples__:\n> \` /class join engr101 \`\n> \` /class leave lib160 \`\n> \` /class leave-all    \`\n\n❓ Don't see your class? Create a support ticket in the \<#866434475495129118> channel or send a message in \<#818298262586785822>!\n\n❤️ Enjoying the server? Invite your friends \▶️ https://discord.gg/3DS5YMTj5q\n\n😕 Still confused? Reach out to the mods using the \<#866434475495129118> channel and we'll be able to help you get started!`);
                await channel.client.fetchWebhook(channelID).then(webhook => {
                    webhook.send({ content: `⏫ [Jump to the top](${msg.url}) ⏫` })
                })
            })


            interaction.channel.send({ content: `resetting getting-started`, });
            break;

        case `contact-mods`:

            // get channel ID, then fetch channel object
            channelID = client.config.CHANNELS.CONTACT_MODS;
            channel = interaction.member.guild.channels.cache.get(channelID);
            clearChannelMessages(channel)

            interaction.channel.send({ content: `resetting contact-mods`, });

            // create embed with instructions and buttons
            const contactModsEmbed = client.embedCreate({
                title: `☎️  Contact the server moderators!`,
                description: `By clicking on \`🏷️ Create a Ticket!\` below, you will create a support ticket where you are able to directly talk to the moderators. The channel will be only be visible to you and the moderation team. You can also click \`👥 Join the Mod Team!\` and apply to be a member of the Online College Mod Team!\n\n**Use this ticket system to contact the mods for any of the following situations:**\n◦ You would like to promote content in the server\n\n◦ You would like to report a user for:\n> › inappropriate behavior in the server\n> › sending unsolicited DMs\n> › some other concern\n\n◦ You have a private concern`,
                color: `04b464`,
            });

            const ticketOptions = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ticket_create')
                        .setLabel(`Create a Ticket`)
                        .setStyle('SECONDARY')
                        .setEmoji(`🏷️`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('modapp_create')
                        .setLabel(`Join the Mod Team!`)
                        .setStyle('SECONDARY')
                        .setEmoji(`👥`)
                )

            return interaction.channel.send({ embeds: [contactModsEmbed], components: [ticketOptions] });

    }
}

async function clearChannelMessages(channel) {
    const fetchedMessages = await channel.messages.fetch({ limit: 100 });
    return await channel.bulkDelete(fetchedMessages);
}