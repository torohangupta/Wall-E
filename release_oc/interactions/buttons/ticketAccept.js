const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    
    id: `ticketAccept`,

    execute(interaction) {

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const ticketAcceptEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`6ea343`)
            .setDescription(`Please confirm that you'd like to open a ticket`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`ticketAcceptConfirm`)
                    .setLabel(`Confirm?`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`✔️`)
            )

        interaction.channel.send({ embeds: [ticketAcceptEmbed], components: [row] });
    },
};