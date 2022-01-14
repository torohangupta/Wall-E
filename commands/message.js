const { MessageEmbed } = require("discord.js");

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
            .setTitle('🏷️Contact the server moderators!')
            .setColor('08B064')
            .setDescription(`By pressing the button below, you will create a support ticket where you are able to directly talk to the moderators. The channel will be only be visible to you and the moderation team\n\n**Use this ticket system to contact the mods for any of the following situations:**\n◦ You would like to promote content in the server\n\n◦ You would like to report a user for:\n> › inappropriate behavior in the server\n> › sending unsolicited DMs\n> › some other concern\n\n◦ You have a private concern`)

        message.channel.send({embeds: [embed]})
    },
};