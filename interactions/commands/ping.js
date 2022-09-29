module.exports = {

    name: `ping`,

    execute(interaction) {

        interaction.reply({ content: `pong`, allowedMentions: { repliedUser: false } });
    }
};