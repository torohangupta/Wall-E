const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { roleID, walle, channelID } = require(`../../dependencies/resources/config.json`);

module.exports = {

    id: `modappSubmit`,

    async execute(interaction) {

        // fetch all messages from channel
        var fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });

        // check count of messages in the channel that the user has sent. For each message, iterate userMessageCount
        let userMessageCount = 0;
        fetchedMessages.forEach(msgObject => {
            if (msgObject.author.id != walle.id) userMessageCount++;
        });

        // if the user has not sent any messages, they can't submit their application
        if (userMessageCount == 0) {
            return interaction.reply({ content: `Please complete the application before submitting it!`, ephemeral: true });
        }

        // reply to the interaction
        interaction.deferUpdate();

        // perform interaction actions
        interaction.channel.permissionOverwrites.create(interaction.user, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
        interaction.channel.permissionOverwrites.create(roleID.mod, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

        // send confirmation embed
        const modappSubmitEmbed = new MessageEmbed()
            .setTitle(`Moderator Application - ${interaction.user.username.toLowerCase().replace(/[^a-z]+/g, '')}`)
            .setColor(`4b6999`)
            .setDescription(`Thank you for submitting your application! We appreciate the time you spent and we'll be in touch soon! To get a transcript of your application, please make sure you have DMs from server members enabled.`);

        // send notification to mod team
        interaction.client.channels.cache.get(channelID.modPrivate).send({ content: `A new moderator application was submitted!` })

        // edit first message to remove buttons and remove all other embeds
        var applicationEmbed = await interaction.channel.messages.fetch({ limit: 100 });
        var cachedMessages = applicationEmbed.map(m => m)
        for (let i = 0; i < cachedMessages.length - 1; i++) {
            if (cachedMessages[i].embeds.length > 0) {
                await cachedMessages[i].delete();
            }
        }

        // if there is a tagged user, use that, otherwise use the interaction author
        const guildMember = interaction.member;
        const guildUser = guildMember.user;
        const guildNickname = guildMember.nickname ? guildMember.nickname : guildMember.user.username;
        const guildUserAvatar = guildUser.displayAvatarURL({ format: "png", dynamic: true });

        // get the member's roles
        const allUserRoles = guildMember.roles.cache.sort((a, b) => b.position - a.position).map(r => r);
        const serverRoles = allUserRoles.slice(0, allUserRoles.length - 1).join(`, `);

        // get account join information & convert to date, time & days elapsed
        const discordJoinDate = new Date(guildMember.user.createdAt)
        const discordDateJoined = discordJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
        const discordTimeJoined = discordJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
        const accountAge = Math.floor((Date.now() - discordJoinDate) / 86400000);

        // get user's server join information & convert to date, time & days elapsed
        const serverJoinDate = new Date(guildMember.joinedTimestamp)
        const serverDateJoined = serverJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
        const serverTimeJoined = serverJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
        const daysOnServer = Math.floor((Date.now() - serverJoinDate) / 86400000);

        // create the embed
        const profileEmbed = new MessageEmbed()
            .setAuthor({ name: `User Profile: ${guildNickname}`, iconURL: guildUserAvatar })
            .setDescription(`\n**User Tag:** <@!${guildUser.id}>\n\n**Server Roles:** ${serverRoles}`)
            .setColor(`4b6999`)
            .addFields(
                { name: `\u200B`, value: `**Joined Discord:**\n${discordDateJoined}\n${discordTimeJoined}\nAccount Age: ${accountAge} Days`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `\u200B`, value: `**Joined ${interaction.guild}:**\n${serverDateJoined}\n${serverTimeJoined}\nTime on Server: ${daysOnServer} Days`, inline: true }
            )
            .setTimestamp(Date.now())
            .setFooter({ text: `Application submitted` });

        // delete buttons in initial message
        cachedMessages[cachedMessages.length - 1].edit({ components: [] });

        const modappEmbedButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('modappArchive')
                    .setLabel(`Archive Application`)
                    .setStyle('SECONDARY')
                    .setEmoji(`💾`)
            )

        // send confirmation embed
        interaction.channel.send({ embeds: [modappSubmitEmbed, profileEmbed], components: [modappEmbedButtons] });
    },
};