const { MessageEmbed } = require("discord.js");
const { magic8responses } = require(`../messages.json`);
const { consoleChannel } = require(`../config.json`);

module.exports = {

    name: `magic8`,
    aliases: [`magic8`, `m8`],
    description: `Wisdom of the magic 8 ball answers your questions`,
    usage: `[question]`,
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

        // Delete passed command & log deletion in console
        message.delete()
            .then(() => {
                console.log(`Deleted '${message}' from ${uName}`)
                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${message}\` from \`${uName}\``);
            })
            .catch(console.error);

        // Isolate question
        let str = '';
        for (let i = 1; i <= args.length; i++) {
            str += args[i - 1] + ' ';
        }
        var question = str.trim();

        // Generate random length
        var choice = Math.floor(Math.random() * magic8responses.length);

        // generate embed with response
        const m8embed = new MessageEmbed()
            .setAuthor(`Magic-8 Ball`, `https://magic-8ball.com/assets/images/Our_magic_8_ball.png`)
            .setTitle(question)
            .setColor(`00539C`)
            .addFields(
                { name: `\u200B`, value: `\`\`\`${magic8responses[choice]}.\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // Send embed & log run data
        message.channel.send(m8embed)

        console.log(`Magic8 log: Question: '${question}' Reply choice: ${choice}, '${magic8responses[choice]}'. Asked by ${uName}.`)
        message.client.channels.cache.get(consoleChannel).send(`Magic8 log: Question: '${question}' Reply choice: ${choice}, '${magic8responses[choice]}'. Asked by ${uName}.`);
    },
};