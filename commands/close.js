const { MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`)

module.exports = {

    name: `close`,
    aliases: [`close`],
    description: `Initiate the ticket close process. Can't be used outside of a support ticket.`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {
        if (!message.channel.name.includes(`ticket-`)) return;
        if (!message.member._roles.includes(`692097359005351947`)) return;

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

        message.channel.send({ embeds: [ticketCloseEmbed], components: [row] });

    },
};