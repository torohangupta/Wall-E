const { MessageEmbed } = require("discord.js");

module.exports = {

    name: `odds`,
    aliases: [`odds`],
    description: `Play 'What Are the Odds?' using Wall-E`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {

        const oddsEmbed = new MessageEmbed()
            .setTitle(`What are the odds?`)
            .setColor(`E39F8D`)
            .setDescription(`Reply in 10 seconds with your upper bound & Wall-E will try to beat the odds!`)
            .setFooter(`Asked by: ${message.author.username}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))


        message.channel.send(oddsEmbed).then(botmsg => {
            const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { max: 1, time: 10000 });
            collector.on('collect', msg => {
                try {
                    var oddsUpper = Math.round(parseInt(msg.content));
                    var guess = Math.floor(Math.random() * oddsUpper + 1);

                    const oddsEdited = new MessageEmbed()
                        .setTitle(`What are the odds?`)
                        .setColor(`E39F8D`)
                        .setDescription(`\u200B`)
                        .addFields(
                            { name: `Bounds`, value: `\`\`\`1 - ${oddsUpper}\`\`\``, inline: true },
                            { name: `Wall-E's Guess`, value: `\`\`\`${guess}\`\`\``, inline: true }
                        )
                        .setFooter(`Challenged by: ${message.author.username}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

                    // Delete passed command & log deletion in console
                    msg.delete()
                        .then(msg => console.log(`Deleted '${msg}' from ${msg.author.username}`))
                        .catch(console.error);
                    botmsg.edit(oddsEdited)
                    console.log(`Edited embed for ~odds requested by ${message.author.username}`)

                } catch (error) {
                    message.channel.send(`There was an error.`);
                    console.log(error)
                    return;
                }
            })
        })
    },
};