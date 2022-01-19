const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `ticketCancel`,

    execute(interaction) {

        // only mods can complete the modapp
        if (!interaction.member._roles.includes(`692097359005351947`)) {
            return interaction.reply({ content: `I'm sorry, only moderators can use this command!`, ephemeral: true });
        }

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const ticketCancelEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`a84c32`)
            .setDescription(`Please confirm that you'd like to complete & archive this application.`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`ticketCancelConfirm`)
                    .setLabel(`Confirm?`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`✔️`)
            )

        interaction.channel.send({ embeds: [ticketCancelEmbed], components: [row], ephemeral: true});
    },
};