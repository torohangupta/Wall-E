const { MessageEmbed } = require(`discord.js`);

module.exports = {

    name: `class`,
    whitelistedChannels: ``,
    blacklistedChannels: ``,

    execute(interaction) {
        // /class join class: classcode

        const subCommand = interaction.options._subCommands;
        var args = ``;
        if ([`join`, `leave`, `create`, `delete`].includes(subCommand)) {
            args = interaction.options._hoistedOptions[0].value;
        }
        // console.log(args)

        // const {name} = interaction.options.map(o => o);
        console.log(interaction.options._hoistedOptions[0].value)
        // interaction.options.map(o => console.log(o.name));
        interaction.reply(`okay`);
        console.log(interaction.guild)

        

        switch (subCommand) {
            case `join`:
                console.log(`add`)
                break;
            case `leave`:
                console.log(`rm`)
                break;
            case `leave-all`:
                console.log(`rmall`)
                break;
            case `create`:
                console.log(`create`)
                break;
            case `delete`:
                console.log(`del`)
                break;
        }

        // reply to the interaction
        // if (interaction.user.id != `382893405178691584`) {
        //     return interaction.reply({ content: `Wait a second... you're not Rohan. You can't use that command!`, ephemeral: true });
        // }

        // destructure options from slash command
        // const { value: id } = interaction.options.get('id');
        // const { value: label } = interaction.options.get('label');
        // const { value: background } = interaction.options.get('background');
        // const { value: emoji } = interaction.options.get(`emoji`)


        // console.log(id)

        // const row = new MessageActionRow()
        //     .addComponents(
        //         new MessageButton()
        //             .setCustomId(id.toLowerCase().replace(/[^a-z]+/g, ''))
        //             .setLabel(label)
        //             .setStyle(background)
        //             .setEmoji(emoji.toString())
        //     )

        // interaction.reply({ content: `Fall Semester Wall-E Update Tease`, components: [row] });
        function classCodeTest(classCode) {

            const regex = /([a-z]{2,4}\d{3})/g;
            return regex.text(classCode);
        }
    },
};