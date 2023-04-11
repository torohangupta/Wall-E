const errReply = { content: `You can't use this command!`, ephemeral: true };

module.exports = {

    name: `say`,

    async execute(client, interaction) {

        // destructure the interaction object
        const { member, channel, options } = interaction;

        // get the phrase to send
        const phrase = options._hoistedOptions[0].value;

        // only allow Rohan to use the command
        if (member.user.id !== client.config.OWNER_ID) return interaction.reply(errReply);
        else await interaction.reply({ content: `Sending...`, ephemeral: true });

        // send the message
        await channel.send({ content: phrase });
        return await interaction.editReply({ content: `Sent!`, ephemeral: true });
    }
};