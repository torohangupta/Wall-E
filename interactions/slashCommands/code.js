const { MessageEmbed } = require(`discord.js`);

module.exports = {

    name: `code`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        const codeEmbed = new MessageEmbed()
            .setTitle(`Code Block Formatting`)
            .setColor(`2C5F2D`)
            .setDescription(`When sharing code in Discord, a code block makes it a lot easier to read!`)
            .addFields(
                { name: `\u200B`, value: `When sending code, put 3 backticks (under the \`ESC\` key) (\\\`\\\`\\\`) before and after the code to format it as a code block.` },
                { name: `\u200B`, value: `**This:**\n\\\`\\\`\\\`\nThis is a code block\n\\\`\\\`\\\``, inline: true },
                { name: `\u200B`, value: `**Will result in:** \`\`\` This is a code block! \`\`\``, inline: true },
                { name: `\u200B`, value: `Discord also supports language formatting! If I want to send MATLAB code, I would add "matlab" after the first 3 backticks (\` \`\`\`matlab\`) and Discord will format the MATLAB code accordingly, like this:\`\`\`matlab\nclear, clc\n% Rohan Gupta\n\n% Define variables\nvariable = 1;\n\nif variable = 1\n     disp('Hello World!')\nelse\n     disp('variable does not equal 1')\nend\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        interaction.reply({ embeds: [codeEmbed], allowedMentions: { repliedUser: false } });
    }
};