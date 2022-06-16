const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require(`discord.js`);
const { roleID } = require(`../../dependencies/resources/config.json`);

module.exports = {

    name: `ticket`,

    execute(interaction) {

        // other important stuff
        const userRoleIDs = interaction.member._roles;
        var subCommand = interaction.options._subcommand;
        var member = [`open`, `add`, `remove`].includes(subCommand) ? interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].value) : ``;

        // console.log(member)

        switch (subCommand) {
            case `close`:  // close a support ticket (must be used in a ticket channel)

                // if the channel is not a ticket channel or the user is not a mod, return
                if (!interaction.channel.name.includes(`ticket-`)) {
                    return interaction.reply({ content: `Please use this command in a support ticket channel`, ephemeral: true });
                }

                if (!interaction.member._roles.includes(roleID.mod)) {
                    return interaction.reply({ content: `You must be a moderator to use this command.`, ephemeral: true });
                }

                // send confirmation embed
                const ticketCloseEmbed = new MessageEmbed()
                    .setTitle(`Confirm?`)
                    .setColor(`6ea343`)
                    .setDescription(`Please confirm that you'd like to close this ticket`)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`ticketCloseConfirm`)
                            .setLabel(`Confirm?`)
                            .setStyle(`PRIMARY`)
                            .setEmoji(`✔️`)
                    )

                // reply with ephermaral embed
                interaction.reply({ embeds: [ticketCloseEmbed], components: [row], ephemeral: true });

                break;
            case `open`:   // open a support ticket on another user`s behalf (must be a mod)

                // determine if the user has a ticket open already or not
                usernameScrubbed = member.user.username.toLowerCase().replace(/[^a-z]+/g, ``);
                const textChannels = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`ticket`)).map(c => c.name);

                if (textChannels.includes(`ticket-${usernameScrubbed}`)) {
                    return interaction.reply({ content: `That user already has a support ticket open.`, ephemeral: true });
                } // if the user has a ticket open already, return

                if (member._roles.includes(roleID.bots)) {
                    return interaction.reply({ content: `You cannot open a support ticket on behalf of a bot.`, ephemeral: true });
                } // disallow opening tickets for bots

                if (member._roles.includes(roleID.mods)) {
                    return interaction.reply({ content: `You cannot open a support ticket on behalf of a mod.`, ephemeral: true });
                } // disallow opening tickets for mods

                // open the ticket
                interaction.member.guild.channels.create(`ticket-${usernameScrubbed}`, {
                    type: `GUILD_TEXT`,
                    parent: `788914542427111455`, // support category channel ID
                    permissionOverwrites: [
                        {
                            id: interaction.channel.guild.roles.everyone,
                            deny: [`VIEW_CHANNEL`],
                        },
                        {
                            id: roleID.mod, // Supreme Overseers
                            allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`],
                        },
                        {
                            id: member.user.id,
                            allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`],
                        },
                    ],
                }).then(supportChannel => {

                    // send confirmation embed
                    const ticketOpenEmbed = new MessageEmbed()
                        .setTitle(`Support Ticket - ${member.user.username.toLowerCase().replace(/[^a-z]+/g, ``)}`)
                        .setColor(`6AA4AD`)
                        .setDescription(`Hello, ${member}!\n\nA support ticket has been opened on your behalf. A mod will be with you shortly!\n\nTo recieve a transcript of your ticket, make sure you allow direct messages from server members.`)

                    supportChannel.send(`@here`).then(m => m.delete());
                    supportChannel.send(member).then(m => m.delete());
                    supportChannel.send({ embeds: [ticketOpenEmbed] });
                });

                return interaction.reply({ content: `A ticket was opened on ${member}'s behalf.`, ephemeral: true });
            case `add`:    // add a user to the current support ticket (must be used in a ticket channel)

                if (!interaction.channel.name.includes(`ticket-`)) {
                    return interaction.reply({ content: `Please use this command in a support ticket.`, ephemeral: true });
                }

                if (member._roles.includes(roleID.bots)) {
                    return interaction.reply({ content: `You cannot add a bot to a support ticket.`, ephemeral: true });
                } // disallow adding bots to tickets

                if (member._roles.includes(roleID.mod)) {
                    return interaction.reply({ content: `You cannot add moderators to a support ticket.`, ephemeral: true });
                }

                interaction.channel.permissionOverwrites.create(member.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true }).then(supportChannel => {

                    // send confirmation embed
                    const ticketOpenEmbed = new MessageEmbed()
                        .setTitle(`Support Ticket - ${member.user.username.toLowerCase().replace(/[^a-z]+/g, ``)}`)
                        .setColor(`6AA4AD`)
                        .setDescription(`Hello, ${member}!\n\nYou have been added to this support ticket.\n\nTo recieve a transcript of your ticket, make sure you allow direct messages from server members.`)

                    interaction.reply({ content: `${member}` }).then(m => m.delete());
                    supportChannel.send({ embeds: [ticketOpenEmbed] });
                });
                break;
        }
    }
};