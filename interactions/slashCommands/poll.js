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
        console.log(question)
        console.log(options)

        if (options.length >= 2 && options.length <= 20) {

            var optField = `${letters[0]} : ${options[0]}\n`;
            // Create embed & populate common fields
            var optionsEmbed = new MessageEmbed()
                .setAuthor(`New Poll:`)
                .setColor(`E94B3C`)
                .setTimestamp(Date.now())
                .setFooter(`Asked by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

            // dynamically create the options block based on number of options passed
            for (let i = 1; i <= options.length - 1; i++) {
                optField += letters[i] + ` : ` + options[i] + `\n`;
            }

            optionsEmbed.addFields(
                { name: `\u200B`, value: `**${options[0]}**\n\n${optField}` }
            ) // Add options to embed

            interaction.reply({ embeds: [optionsEmbed], allowedMentions: { repliedUser: false }, fetchReply: true}).then(pollEmbed => {
                for (let i = 0; i <= options.length - 1; i++) {
                    optEmb.react(letters[i])
                } // React with emojis
            }) // reply to interaction

        } else {
            interaction.reply(`This command only supports between 2 and 20 options. Please list a valid nunber of options.`)
        }

        // create embed for poll
        // var voteEmbed = new MessageEmbed()
        //     .setTitle(`New Poll:`)
        //     .setColor(`4F674F`)
        //     .setDescription(question)
        //     .setTimestamp(Date.now())
        //     .setFooter(`Asked by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        // post embed for poll and react with check or cross
        // interaction.reply({ embeds: [voteEmbed], allowedMentions: { repliedUser: false }, fetchReply: true}).then(pollEmbed => {
        //     pollEmbed.react(checkmark.emote)
        //     pollEmbed.react(crossmark.emote)
        // })
    // interaction.reply(`ok`)
    }
};