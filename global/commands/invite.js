const { MessageEmbed } = require("discord.js");

module.exports = {

    name: `invite`,
    aliases: [`invite`, `inv`],
    description: `Sends an embed containing Wall-E's invite link.`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Generate & send embed
        const inviteEmbed = new MessageEmbed()
            .setAuthor('Wall-E Bot', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
            .setTitle(`Invite Wall-E to your server!`)
            .setColor(`CC743C`)
            .setDescription('You can use this [link](https://discord.com/api/oauth2/authorize?client_id=738513970930909194&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Fnew&scope=bot%20applications.commands) to invite Wall-E or copy the following link: \n\`\`\`https://discord.com/api/oauth2/authorize?client_id=738513970930909194&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.com%2Fnew&scope=bot\`\`\`')
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        return message.channel.send({embeds: [inviteEmbed]});

    },
};