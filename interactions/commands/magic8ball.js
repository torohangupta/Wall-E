module.exports = {

    name: `magic8ball`,

    execute(client, interaction) {

        const question = interaction.options._hoistedOptions[0].value;
        const guildMember = interaction.guild.members.cache.get(interaction.member.id);
        const userName = guildMember.nickname ? guildMember.nickname : guildMember.user.username;

        const magic8responses = [
            `As I see it, yes`,
            `Ask again later`,
            `Better not tell you now`,
            `Cannot predict now`,
            `Concentrate and ask again`,
            `Don't count on it`,
            `It is certain`,
            `It is decidedly so`,
            `Most likely`,
            `My reply is no`,
            `My sources say no`,
            `Outlook not so good`,
            `Outlook good`,
            `Reply hazy, try again`,
            `Signs point to yes`,
            `Very doubtful`,
            `Without a doubt`,
            `Yes`,
            `Yes – definitely`,
            `You may rely on it`
        ];

        // Generate random length
        var choice = Math.floor(Math.random() * magic8responses.length);

        // generate embed with response
        const magic8embed = client.embedCreate({
            title: `🎱 | ${question}`,
            fields: [
                { name: `\u200B`, value: `\`\`\`${magic8responses[choice]}.\`\`\`` },
            ],
            color: `00539C`,
            footer: { text: `Asked by: ${userName}`, iconURL: guildMember.user.displayAvatarURL({ format: `png`, dynamic: true }) },
            timestamp: true,
        });

        interaction.reply({ embeds: [magic8embed], allowedMentions: { repliedUser: false } });
    }
};