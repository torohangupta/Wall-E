const { MessageEmbed } = require("discord.js");

module.exports = {

    name: `profile`,
    aliases: [`profile`, 'user', 'pf'],
    description: `Displays a tagged user's profile & more information. If no one is tagged, return the message author's info.`,
    usage: `OR ~profile @[user]`,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message) {

        if (!message.mentions.users.size) {
            user = message.author;

        } else {
            // get all tagged users & save first tagged user in user
            taggedusers = message.mentions.users.map(u => u);
            user = taggedusers[0];
        }

        // create & resolve promise for user information
        message.guild.members.fetch(user).then(function (taggedGuildUser) {

            // get user's server roles & remove @everyone
            let allUserRoles = taggedGuildUser.roles.cache.sort((a, b) => b.position - a.position).map(r => r)
            uniqueUserRoles = allUserRoles.slice(0, allUserRoles.length - 1).join(`, `)

            // send info to create profile embed
            embedCreator(user, taggedGuildUser.nickname, taggedGuildUser.joinedTimestamp, uniqueUserRoles)
        }).catch(console.error)


        function embedCreator(user, name, serverJoinedTimestamp, serverRoles) {

            /*
            Inputs
                user = user object, used to get nickname & join info for Discord & server
                name = string, (if it exists) a user's nickname on the server
                serverJoinedTimestamp = the time (in unix/Epoch) the user joined the server
                serverRoles = the roles that the user has on the server, ignoring @everyone

            Outputs
                Embed with user profile information
            */

            // if user/tagged user doesn't have a set server nickname, set name as username
            if (!name) name = user.username;

            // get author's username/nickname if it exists
            authorName = message.member.nickname;
            if (!authorName) authorName = message.author.username;

            // get account join information & convert to date, time & days elapsed
            const discordJoinDate = new Date(user.createdAt)
            const discordDateJoined = discordJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
            const discordTimeJoined = discordJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
            accountAge = Math.floor((Date.now() - discordJoinDate) / 86400000);

            // get user's server join information & convert to date, time & days elapsed
            const serverJoinDate = new Date(serverJoinedTimestamp)
            const serverDateJoined = serverJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
            const serverTimeJoined = serverJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
            daysOnServer = Math.floor((Date.now() - serverJoinDate) / 86400000);

            // determine online status
            status = `**Presence:** `
            switch (user.presence.status) {
                case `online`:
                    status += `<:online:784546469168152596> Online`;
                    break;
                case `idle`:
                    status += `<:idle:784546469017026580> Idle`;
                    break;
                case `dnd`:
                    status += `<:dnd:784546468539138058> Do Not Distrub`;
                    break;
                case `offline`:
                    status += `<:offline:784546469100388352> Offline`;
                    break;
            }

            // create the embed
            const profileEmbed = new MessageEmbed()
                .setAuthor(`User Profile: ${name}`, user.displayAvatarURL({ format: "png", dynamic: true }))
                .setDescription(`**Discord ID:** ${user.id}\n**Username:** ${user.username}#${user.discriminator}\n**User Tag:** <@!${user.id}>\n${status}\n\n**Server Roles:** ${serverRoles}`)
                .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
                .setColor(`684793`)
                .addFields(
                    { name: `\u200B`, value: `**Joined Discord:**\n${discordDateJoined}\n${discordTimeJoined}\nAccount Age: ${accountAge} Days`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `\u200B`, value: `**Joined ${message.guild}:**\n${serverDateJoined}\n${serverTimeJoined}\nTime on Server: ${daysOnServer} Days`, inline: true }
                )
                .setTimestamp(Date.now())
                .setFooter(`Requested by: ${authorName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({embeds: profileEmbed})
        }
    }
};