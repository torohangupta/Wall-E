const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `ticketAcceptConfirm`,

    async execute(interaction) {

        // reply to the interaction
        interaction.deferUpdate();

        // perform interaction actions
        interaction.channel.permissionOverwrites.create(interaction.user, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
        interaction.channel.permissionOverwrites.create(`692097359005351947`, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

        // send confirmation embed
        const ticketAcceptConfirmedEmbed = new MessageEmbed()
            .setTitle(`Support Ticket - ${interaction.user.username.toLowerCase().replace(/[^a-z]+/g, '')}`)
            .setColor(`6aa4ad`)
            .setDescription(`Thank you for reaching out! Please let us know\nhow we can help and a mod will be with you ASAP!`)

        const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
        interaction.channel.send(`@here`).then(m => m.delete());
        await interaction.channel.bulkDelete(fetchedMessages);

        interaction.channel.send({ embeds: [ticketAcceptConfirmedEmbed] });
    },
};