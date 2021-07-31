const { MessageActionRow, MessageButton } = require(`discord.js`);

module.exports = {

    name: `createbutton`,

    execute(interaction) {

        // reply to the interaction
        if (interaction.user.id != `382893405178691584`) {
            return interaction.reply({ content: `Wait a second... you're not Rohan. You can't use that command!`, ephemeral: true });
        }

        // destructure options from slash command
        const { value: id } = interaction.options.get('id');
        const { value: label } = interaction.options.get('label');
        const { value: background } = interaction.options.get('background');
        const { value: emoji } = interaction.options.get(`emoji`)


        // console.log(id)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(id.toLowerCase().replace(/[^a-z]+/g, ''))
                    .setLabel(label)
                    .setStyle(background)
                    .setEmoji(emoji.toString())
            )

        interaction.reply({ content: `Fall Semester Wall-E Update Tease`, components: [row] });
    },
};