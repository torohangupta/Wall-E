const { MessageEmbed } = require("discord.js");
const { outofcontextquotes } = require(`../resources/quotes.json`);
const { consoleChannel } = require(`../resources/config.json`);

module.exports = {

    name: `quotes`,
    aliases: [`quote`, `quotes`, `outofcontextquotes`, `ncq`],
    description: `Shares a random, out of context quote`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Delete passed command & log deletion in console
        message.delete()
            .then(message.client.channels.cache.get(consoleChannel).send(`Deleted \`${message}\` from \`${uName}\``))
            .catch(console.error);

        // get a random quote index from list of available quotes
        const quoteSelection = Math.floor(Math.random() * outofcontextquotes.length);

        // create embed with quote
        const quoteEmbed = new MessageEmbed()
            .setAuthor(`Out of Context Quotes`, `https://cdn2.iconfinder.com/data/icons/flat-icons-web/40/Quote_Serif-512.png`)
            .setColor(`1abb9b`)
            .setDescription(outofcontextquotes[quoteSelection])
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send({embeds: quoteEmbed})
        message.client.channels.cache.get(consoleChannel).send(`OutofContextQuotes log: Quote choice: ${quoteSelection}, '${outofcontextquotes[quoteSelection]}'. Asked by ${uName}.`);
    },
};