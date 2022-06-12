const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const { roleID, channelID, walle } = require(`../../dependencies/resources/config.json`);

module.exports = {

    id: `modappArchive`,

    execute(interaction) {

        // only mods can archive the modapp
        if (!interaction.member._roles.includes(roleID.mod)) {
            return interaction.reply({ content: `I'm sorry, only moderators can archive an application!`, ephemeral: true });
        }

        // reply to the interaction
        interaction.deferUpdate();

        // send confirmation embed
        const modappArchiveEmbed = new MessageEmbed()
            .setTitle(`Confirm?`)
            .setColor(`A84C32`)
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