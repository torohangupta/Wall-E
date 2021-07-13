const { MessageEmbed } = require("discord.js");
const { magic8responses } = require(`../resources/8ball.json`);
const { consoleChannel } = require(`../resources/config.json`);

module.exports = {

    name: `magic8ball`,
    aliases: [`magic8ball`, `magic8`, `m8`, `8ball`],
    description: `Wisdom of the magic 8 ball answers your questions`,
    usage: `<question>`,
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

        // Generate random length
        var choice = Math.floor(Math.random() * magic8responses.length);

        // generate embed with response
        const m8embed = new MessageEmbed()
            .setAuthor(`Magic-8 Ball`, `https://magic-8ball.com/assets/images/Our_magic_8_ball.png`)
            .setTitle(args.join(` `))
            .setColor(`00539C`)
            .addFields(
                { name: `\u200B`, value: `\`\`\`${magic8responses[choice]}.\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // Send embed & log run data
        message.channel.send({embeds: m8embed})

        console.log(`Magic8 log: Question: '${args.join(` `)}' Reply choice: ${choice}, '${magic8responses[choice]}'. Asked by ${uName}.`)
        message.client.channels.cache.get(consoleChannel).send(`Magic8 log: Question: '${args.join(` `)}' Reply choice: ${choice}, '${magic8responses[choice]}'. Asked by ${uName}.`);
    },
};