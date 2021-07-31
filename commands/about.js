const { MessageEmbed } = require("discord.js");
const { discord, github, join } = require(`../dependencies/resources/emojis.json`)

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
            .setColor(`#eb9850`)
            .setAuthor(`Wall-E`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
            .setTitle(`About`)
            .setDescription(`A general server management bot, Wall-E now helps run and manage servers with helpful commands and functions.`)
            .setThumbnail(`https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
            .addFields(
                { name: `Links`, value: `${discord.emote} - Development Server: [Link](https://discord.gg/J8mhrke77j)\n${github.emote} - GitHub Repository: [Link](https://github.com/torohangupta/Wall-E)\n${join.emote} - Invite to your server: [Link](https://discord.com/oauth2/authorize?client_id=738513970930909194&permissions=8&scope=bot)` },
                // { name: `\u200B`, value: `\u200B` },
                { name: `Help`, value: `\`~about\`` }
            )
            .setFooter(`Wall-E/Wall-E Development`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
            .setTimestamp();
    
    message.channel.send({ embeds: [embed] }); // djs v13
    },
};