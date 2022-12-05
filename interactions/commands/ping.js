module.exports = {

    name: `ping`,

    execute(client, interaction) {

        interaction.reply({ content: `pong`, allowedMentions: { repliedUser: false } });
    }
};