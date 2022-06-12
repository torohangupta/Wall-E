const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `modappCancel`,

    execute(interaction) {

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const modappCancelEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`A84C32`)
            .setDescription(`Please confirm that you'd like to cancel your application.`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`modappCancelConfirm`)
                    .setLabel(`Confirm?`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`✔️`)
            )

        interaction.channel.send({ embeds: [modappCancelEmbed], components: [row] });
    },
};