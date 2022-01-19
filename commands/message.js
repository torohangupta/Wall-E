const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {

    name: `contactmodsmessage`,
    aliases: [`cmm`],
    description: `This is a description`,
    usage: `usage`,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {

        var embed = new MessageEmbed()
            .setTitle('☎️  Contact the server moderators!')
            .setColor('08B064')
            .setDescription(`By clicking on \`🏷️ Create Ticket\` below, you will create a support ticket where you are able to directly talk to the moderators. The channel will be only be visible to you and the moderation team. You can also click \`👥 Mod Application\` to apply to join the mod team!\n\n**Use this ticket system to contact the mods for any of the following situations:**\n◦ You would like to promote content in the server\n\n◦ You would like to report a user for:\n> › inappropriate behavior in the server\n> › sending unsolicited DMs\n> › some other concern\n\n◦ You have a private concern`)

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticketCreate')
                    .setLabel(`Create a Ticket!`)
                    .setStyle('SECONDARY')
                    .setEmoji(`🏷️`)
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('modappCreate')
                    .setLabel(`Join the Mod Team!`)
                    .setStyle('SECONDARY')
                    .setEmoji(`👥`)
            )
        

        message.channel.send({ embeds: [embed], components: [buttons] });
    },
};