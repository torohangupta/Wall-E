const { MessageEmbed } = require("discord.js");
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
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {

        // Store possible answers in array
        var m8responses = [`As I see it, yes`, `Ask again later`, `Better not tell you now`, `Cannot predict now`, `Concentrate and ask again`, `Don't count on it`, `It is certain`, `It is decidedly so`, `Most likely`, `My reply is no`, `My sources say no`, `Outlook not so good`, `Outlook good`, `Reply hazy, try again`, `Signs point to yes`, `Very doubtful`, `Without a doubt`, `Yes`, `Yes – definitely`, `You may rely on it`];

        // get nickname, if user doesn't have a set nickname, return username
        if (!message.member.nickname) {
            uName = message.author.username;

        } else {
            uName = message.member.nickname;
        }

        // Delete passed command & log deletion in console
        message.delete()
            .then(msg => {
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
        var choice = Math.floor(Math.random() * 20);

        // generate embed with response
        const m8embed = new MessageEmbed()
            .setAuthor(`Magic-8 Ball`, `https://magic-8ball.com/assets/images/Our_magic_8_ball.png`)
            .setTitle(question)
            .setColor(`00539C`)
            .addFields(
                { name: `\u200B`, value: `\`\`\`${m8responses[choice]}.\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Asked by: ${message.author.username}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        // Send embed & log run data
        message.channel.send(m8embed)

        console.log(`magic8 log: Question: '${question}' Reply choice: ${choice}, '${m8responses[choice]}'. Asked by ${message.author.username}.`)
        message.client.channels.cache.get(consoleChannel).send(`Magic8 log: Question: '${question}' Reply choice: ${choice}, '${m8responses[choice]}'. Asked by ${message.author.username}.`);
    },
};