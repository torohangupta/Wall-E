const { MessageEmbed } = require("discord.js");
const { letters } = require(`../emojis.json`)

module.exports = {

    name: `options`,
    aliases: [`options`, `multiplechoice`, `mc`, `o`, `opt`],
    description: `Creates a poll (with A, B & C options) for members to vote via reactions. Supports up to 20 options due to Discord API limitations for number of reactions on a message.`,
    usage: `Question; Option 1; Option 2; Option 3, etc... (Up to 20 total options)`,
    requiredPermissions: ``,

    args: true,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Creating uniform string with arguments
        let str = '';
        for (let i = 1; i <= args.length; i++) {
            str += args[i - 1] + ' ';
        }
        var optSpltr = str.split('; ')

        // try to parse first argument as number
        var numOptions = parseInt(args[0]);

        // Create embed & populate common fields
        var optionsEmbed = new MessageEmbed()
            .setAuthor(`New Poll:`)
            .setColor(`E94B3C`)
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // Define optFields
        var optField = `${letters[0]} : ${optSpltr[1]}\n`;

        // andy's death options embed
        if (numOptions / numOptions == 1) {

            optionsEmbed.setTitle(optSpltr[1])
            var optField = `${letters[0]} : ${optSpltr[2]}\n`;

            for (let i = 1; i <= numOptions - 1; i++) {
                optField += letters[i] + ` : ` + optSpltr[2] + `\n`;
            } // for numOptions, options, list optSpltr[2] as each option

            optionsEmbed.addFields(
                { name: `\u200B`, value: `**${optSpltr[0]}**\n\n${optField}` }
            ) // Add options to embed

            return message.channel.send(optionsEmbed).then(optEmb => {
                for (let i = 0; i <= numOptions - 1; i++) {
                    optEmb.react(letters[i])
                } // React with emojis
            }) // Send embed

        } else {

            var numOptions = optSpltr.length - 1;

            if (numOptions >= 2 && numOptions <= 20) {
                // Delete passed command & log deletion in console
                message.delete()
                    .then(msg => {
                        console.log(`Deleted '${message}' from ${uName}`)
                    })
                    .catch(console.error);

                // dynamically create the options block based on number of options passed
                for (let i = 1; i <= numOptions - 1; i++) {
                    optField += letters[i] + ` : ` + optSpltr[i + 1] + `\n`;
                }

                optionsEmbed.addFields(
                    { name: `\u200B`, value: `**${optSpltr[0]}**\n\n${optField}` }
                ) // Add options to embed

                message.channel.send(optionsEmbed).then(optEmb => {
                    for (let i = 0; i <= numOptions - 1; i++) {
                        optEmb.react(letters[i])
                    } // React with emojis
                }) // Send embed

            } else {
                message.channel.send(`This command only supports between 2 and 20 options. Please list a valid nunber of options.`)
            }
        }
    },
};