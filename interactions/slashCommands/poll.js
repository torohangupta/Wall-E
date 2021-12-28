const { MessageEmbed } = require('discord.js');
const { letters } = require(`../../dependencies/resources/emojis.json`);

module.exports = {

    name: `poll`,
    whitelistedChannels: [],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const question = interaction.options._hoistedOptions[0].value;
        const options = interaction.options._hoistedOptions[1].value.split(`,`).map(elem => { return elem.trim() });
        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        if (options.length >= 2 && options.length <= 20) {

            // dynamically create the options block based on number of options passed
            var optionsField = ``; // create blank string for options field
            for (let i = 0; i <= options.length - 1; i++) {
                optionsField += letters[i] + ` : ` + options[i] + `\n`;
            }

            // Create embed & populate common fields
            var optionsEmbed = new MessageEmbed()
                .setAuthor(question)
                .setColor(`E94B3C`)
                .addFields({ name: `\u200B`, value: `${optionsField}` })
                .setTimestamp(Date.now())
                .setFooter(`Asked by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

            interaction.reply({ embeds: [optionsEmbed], allowedMentions: { repliedUser: false }, fetchReply: true}).then(pollEmbed => {
                for (let i = 0; i <= options.length - 1; i++) {
                    pollEmbed.react(letters[i])
                } // React with emojis
            }) // reply to interaction

        } else {
            interaction.reply(`This command only supports between 2 and 20 options. Please list a valid nunber of options.`)
        }
    }
};