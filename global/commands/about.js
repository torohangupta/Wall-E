const { MessageEmbed } = require("discord.js");
const { discord, github, join } = require(`../resources/emojis.json`)

module.exports = {
     
    name: `about`,
    aliases: [`about`, `info`, `walle`],
    description: `Get info about Wall-E!`,
    usage: ``,

    permissions: [], // list permissions required to run command
    flags: [], // list flags if true/required
    restrictions: [], // usage restriction

    execute(message, args) {
        const embed = new MessageEmbed()
            .setColor(`#0099ff`)
            .setTitle(`Wall-E`)
            .setDescription(`A general server management bot, Wall-E now helps run and manage servers with helpful commands and functions.`)
            .setThumbnail(`https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
            .addFields(
                { name: `\u200B`, value: `${discord.emote} - [Development Server](https://discord.gg/J8mhrke77j)\n${github.emote} - [GitHub Repository](https://github.com/torohangupta/Wall-E)\n${join.emote} - [Invite Link](https://discord.com/oauth2/authorize?client_id=738513970930909194&permissions=8&scope=bot)` },
                { name: `\u200B`, value: `\u200B` },
                { name: `About`, value: `\`~about\``, inline: true },
                { name: `Help`, value: `\`~help\``, inline: true },
            )
            .setFooter(`Wall-E/Wall-E Development - 2021`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
            .setTimestamp();
    
    channel.send(exampleEmbed);
    },
};