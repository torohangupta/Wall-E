const { MessageEmbed } = require("discord.js");
const { consoleChannel } = require(`../resources/config.json`)

module.exports = {

    name: `codeblockformatting`,
    aliases: [`codeblock`, `codeblockformatting`, `cbf`, `code`],
    description: `Instructions on how to format a code block`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        const cbfEmbed = new MessageEmbed()
            .setAuthor('Wall-E Bot', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
            .setTitle(`Code Block Formatting`)
            .setColor(`2C5F2D`)
            .setDescription(`Here's a quick tutorial on how to format code blocks in Discord. If your're sharing code in Discord, using code block formatting will make it a lot easier to read and understand the code.`)
            .addFields(
                { name: `\u200B`, value: `When sending code, put 3 accent marks (\\\`\\\`\\\`) before and after the code to format it as a code block.` },
                { name: `\u200B`, value: `**This:**\n\\\`\\\`\\\`\nThis is a code block\n\\\`\\\`\\\``, inline: true },
                { name: `\u200B`, value: `**Will result in:** \`\`\` This is a code block! \`\`\``, inline: true },
                { name: `\u200B`, value: `Helping edit someone's code? add "diff" after the first 3 accent marks, like this, \\\`\\\`\\\`diff, and use "+" and "-" to suggest lines to add/remove! It will look like this:\`\`\`diff\n- This is a line of coke.\n+ This is a line of code.\`\`\`` },
                { name: `\u200B`, value: `Finally, Discord supports formatting based off the language as well. If I want to send MATLAB code, I would add "matlab" after the first 3 accent marks, like \\\`\\\`\\\`matlab, and Discord will format the MATLAB code accordingly, like this:\`\`\`matlab\nclear, clc\n% Rohan Gupta\n\n% Define variables\nvariable = 1;\n\nif variable = 1\n     disp('Hello World!')\nelse\n     disp('variable does not equal 1')\nend\n\n% end\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send(cbfEmbed).then(m => {
            m.react('❌')

            // create reaction filter & reaction collector
            const deleteFilter = (reaction, user) => { return reaction.emoji.name == '❌' && user.id == message.author.id || user.id == message.mentions.users.map(u => u.id) };
            const collectorDelete = m.createReactionCollector(deleteFilter);
            collectorDelete.on('collect', (reaction, user) => {
                m.delete()
                    .then(console.log(`Deleted cbf embed, requested by \`${uName}\``))
                    .then(message.client.channels.cache.get(consoleChannel).send(`Deleted cbf embed, requested by \`${uName}\``))
                    .catch(console.error);
                message.delete()
                    .then(console.log(`Deleted cbf request command, requested by \`${uName}\``))
                    .then(message.client.channels.cache.get(consoleChannel).send(`Deleted cbf request command, requested by \`${uName}\``))
                    .catch(console.error);
            });

        })

    },
};