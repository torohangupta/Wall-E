const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `modappCreate`,

    execute(interaction) {

        // determine if the user has an application open already or not
        const buttonUser = interaction.member.user;
        const usernameScrubbed = buttonUser.username.toLowerCase().replace(/[^a-z]+/g, '');
        const textChannels = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`modapp`)).map(c => c.name);

        if (textChannels.includes(`modapp-${usernameScrubbed}`)) {
            return interaction.reply({ content: `You already have an application open! Please complete your existing application!`, ephemeral: true });
        } else {
            // reply to the interaction
            interaction.deferUpdate();
        }

        // create embed with instructions and buttons
        const modappEmbed_main = new MessageEmbed()
            .setTitle(`Open a Ticket!`)
            .setDescription(`To confirm opening a new ticket, please press the "📝 Continue" button and a moderator will be able to help you shortly. If this was a mistake, simply close the ticket by clicking the "🔒 Close" button.`)
            .setColor(`6aa4ad`)

        const modappEmbedButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('modappCancel')
                    .setLabel(`Cancel Application`)
                    .setStyle('DANGER')
                    .setEmoji(`🔒`)
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('modappSubmit')
                    .setLabel(`Submit Application`)
                    .setStyle('SUCCESS')
                    .setEmoji(`✔️`)
            )

        // perform interaction actions
        interaction.member.guild.channels.create(`modapp-${usernameScrubbed}`, {
            type: 'GUILD_TEXT',
            parent: interaction.channel.parentId,
            permissionOverwrites: [
                {
                    id: interaction.channel.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: `692097359005351947`, // Supreme Overseers
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: [`SEND_MESSAGES`]
                },
            ],
        }).then(supportChannel => {
            supportChannel.send(`<@${buttonUser.id}>`).then(m => m.delete());
            supportChannel.send({ embeds: [modappEmbed_main], components: [modappEmbedButtons] });
        })

    },
};