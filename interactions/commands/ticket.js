const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {

    name: `ticket`,

    async execute(client, interaction) {

        const { guild, channel, member, options } = interaction;

        // reply to the interaction
        if (!member._roles.includes(client.config.ROLES.MOD)) {
            return interaction.reply({ content: `Only moderators can use the ticket management commands!`, ephemeral: true });
        }

        // other important stuff
        const subCommand = options._subcommand;
        let guildMember, scrubbedUsername;
        if ([`open`, `add`].includes(subCommand)) {
            guildMember = guild.members.cache.get(options._hoistedOptions[0].value);
            scrubbedUsername = usernameScrubbed(guildMember.user);
        }

        // subcommand handling (close, open, add to) ticket
        switch (subCommand) {
            case `close`:  // close a support ticket (must be used in a ticket channel)

                // if the channel is not a ticket channel or the user is not a mod, return
                if (!channel.name.includes(`ticket-`)) {
                    return interaction.reply({ content: `Please use this command in a support ticket channel`, ephemeral: true });
                }

                // create embed with instructions and buttons
                const ticketCloseEmbed = client.embedCreate({
                    title: `Confirm?`,
                    description: `Please confirm that you'd like to close this ticket`,
                    color: `6EA343`,
                });

                const ticketCloseButton = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`ticket_close`)
                            .setLabel(`Confirm?`)
                            .setStyle(`PRIMARY`)
                            .setEmoji(`✔️`)
                    )

                // reply with ephermaral emFFFbed
                return interaction.reply({ embeds: [ticketCloseEmbed], components: [ticketCloseButton], ephemeral: true });
            case `open`:   // open a support ticket on another user`s behalf (must be a mod)

                // determine if the user has a ticket open already or not
                const guildChannels = member.guild.channels.cache.filter(channel =>
                    channel.type === `GUILD_TEXT` && channel.name.includes(`ticket`)
                );
                const textChannels = guildChannels.map(c => c.name);

                // only allow one ticket to be open at a time
                if (textChannels.includes(`ticket-${scrubbedUsername}`)) {
                    const openedTicketChannel= guildChannels.filter(channel => channel.name.includes(`ticket-${scrubbedUsername}`)).map(c => c);

                    return interaction.reply({ content: `That user already has a support ticket open: ${openedTicketChannel}`, ephemeral: true });
                } // if the user has a ticket open already, return

                if (guildMember._roles.includes(client.config.ROLES.BOT)) {
                    return interaction.reply({ content: `You cannot open a support ticket on behalf of a bot!`, ephemeral: true });
                } // disallow opening tickets for bots

                if (guildMember._roles.includes(client.config.ROLES.MOD)) {
                    return interaction.reply({ content: `You cannot open a support ticket on behalf of a mod!`, ephemeral: true });
                } // disallow opening tickets for mods


                // create embed with instructions and buttons
                const ticketEmbed = client.embedCreate({
                    title: `Support Ticket - ${scrubbedUsername}`,
                    description: `Hello, ${guildMember}!\n\nA support ticket has been opened on your behalf. A mod will be with you shortly!\n\nTo recieve a transcript of your ticket, make sure you allow direct messages from server members.`,
                    color: `6AA4AD`,
                });

                // create the support ticket channel, ping the user & delete the message and then send the ticket introduction
                const supportTicketChannel = await guild.channels.create(`ticket-${scrubbedUsername}`, {
                    type: 'GUILD_TEXT',
                    parent: interaction.channel.parentId,
                    permissionOverwrites: [
                        {
                            id: channel.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: client.config.ROLES.MOD, // Supreme Overseers
                            allow: ['VIEW_CHANNEL'],
                        },
                        {
                            id: guildMember.user.id,
                            allow: ['VIEW_CHANNEL', `SEND_MESSAGES`],
                        },
                    ],
                });
                await supportTicketChannel.send({ content: `${guildMember}` }).then(m => m.delete());
                await supportTicketChannel.send({ embeds: [ticketEmbed] });

                return await interaction.reply({ content: `Opening the ticket...`, ephemeral: true });
            case `add`:    // add a user to the current support ticket (must be used in a ticket channel)

                // only allow one ticket to be open at a time
                if (!channel.name.includes(`ticket-`)) {
                    return interaction.reply({ content: `Please use this command in a support ticket channel.`, ephemeral: true });
                } // can only add users to a support ticket channel

                if (guildMember._roles.includes(client.config.ROLES.BOT)) {
                    return interaction.reply({ content: `You cannot add bots to a support ticket!`, ephemeral: true });
                } // disallow adding bots to tickets

                if (guildMember._roles.includes(client.config.ROLES.MOD)) {
                    return interaction.reply({ content: `You cannot add moderators to a support ticket!`, ephemeral: true });
                } // disallow adding mods to tickets

                if (channel.members.map(m => m.user.id).includes(guildMember.user.id)) {
                    return interaction.reply({ content: `This user is already a part of this ticket!`, ephemeral: true });
                } // cannot add a user already in the ticket

                
                // create embed to send to the channel
                const ticketOpenEmbed = client.embedCreate({
                    title: `Additional Ticket Member - ${scrubbedUsername}`,
                    description: `Hello, ${guildMember}!\n\nYou have been added to this support ticket.\n\nTo recieve a transcript of your ticket, make sure you allow direct messages from server members.`,
                    color: `6AA4AD`,
                });

                // add the user to the channel & allow R/W
                await interaction.channel.permissionOverwrites.create(guildMember.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

                // ghost ping the user and send the embed
                await interaction.reply({ content: `${guildMember}` }).then(m => m.delete());
                return await interaction.channel.send({ embeds: [ticketOpenEmbed] });
        }
    }
};

/**
 * Helper function to get the scrubbed user's username OR userID to be used in the ticket channels
 * @param {Object} user A Discord user object
 * @returns {String} Scrubbed username OR userID
 */
function usernameScrubbed(user) {
    // get scrubbed username or set to ID if no a-z characters are detected
    let usernameScrubbed = user.username.toLowerCase().replace(/[^a-z]+/g, '');
    if (usernameScrubbed === ``) { usernameScrubbed = user.id; }

    return usernameScrubbed;
}