const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `modappArchive`,

    execute(interaction) {

        // only mods can archive the modapp
        if (!interaction.member._roles.includes(`692097359005351947`)) {
            return interaction.reply({ content: `I'm sorry, only moderators can archive an application!`, ephemeral: true });
        }

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const modappArchiveEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`a84c32`)
            .setDescription(`Please confirm that you'd like to archive this application.`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`modappArchiveConfirm`)
                    .setLabel(`Confirm?`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`✔️`)
            )

        interaction.channel.send({ embeds: [modappArchiveEmbed], components: [row]});
    },
};