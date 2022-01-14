const { online, idle, dnd, offline } = require('../../dependencies/resources/emojis.json');
const { MessageEmbed } = require('discord.js');

module.exports = {

    name: `profile`,

    async execute(interaction) {

        // if there is a tagged user, use that, otherwise use the interaction author
        const guildMember = interaction.options._hoistedOptions.length > 0 ? interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].value) : interaction.member;
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

        // determine online presenceStatus
        let presenceStatus = `**Presence:** `;
        let memberPresence = guildMember.presence == null ? `offline` : guildMember.presence.status;
        switch (memberPresence) {
            case `online`:
                presenceStatus += `${online.emote} Online`;
                break;
            case `idle`:
                presenceStatus += `${idle.emote} Idle`;
                break;
            case `dnd`:
                presenceStatus += `${dnd.emote} Do Not Distrub`;
                break;
            default:
                presenceStatus += `${offline.emote} Offline`;
                break;
        }

        // create the embed
        const profileEmbed = new MessageEmbed()
            .setAuthor(`User Profile: ${guildNickname}`, guildUserAvatar)
            .setDescription(`**Discord ID:** ${guildUser.id}\n**Username:** ${guildUser.username}#${guildUser.discriminator}\n**User Tag:** <@!${guildUser.id}>\n${presenceStatus}\n\n**Server Roles:** ${serverRoles}`)
            .setThumbnail(guildUserAvatar)
            .setColor(`684793`)
            .addFields(
                { name: `\u200B`, value: `**Joined Discord:**\n${discordDateJoined}\n${discordTimeJoined}\nAccount Age: ${accountAge} Days`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `\u200B`, value: `**Joined ${interaction.guild}:**\n${serverDateJoined}\n${serverTimeJoined}\nTime on Server: ${daysOnServer} Days`, inline: true }
            )
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${guildNickname}`, guildUserAvatar)

        await interaction.reply({embeds: [profileEmbed], allowedMentions: { repliedUser: false }})

    },
};