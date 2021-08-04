const { MessageEmbed } = require('discord.js');
const { consoleChannel } = require(`../dependencies/resources/config.json`);
const { checkmark, crossmark } = require(`../dependencies/resources/emojis.json`)

module.exports = {

    name: `role`,
    aliases: [`role`, `class`, `classrole`, `cr`],
    description: `Use this command to get class roles!`,
    usage: `view/add/remove <class-code>`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        return message.reply({ content:` This command is depricated. Please use \`\\class\``, allowedMentions: { repliedUser: false } });
    }
};