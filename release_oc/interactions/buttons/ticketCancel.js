const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `ticketCancel`,

    execute(interaction) {

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const ticketCancelEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`a84c32`)
            .setDescription(`Please confirm that you'd like to close this ticket`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`ticketCancelConfirm`)
                    .setLabel(`Confirm?`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`✔️`)
            )

        interaction.channel.send({ embeds: [ticketCancelEmbed], components: [row] });
    },
};