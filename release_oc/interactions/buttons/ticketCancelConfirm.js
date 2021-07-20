module.exports = {
    
    id: `ticketCancelConfirm`,

    execute(interaction) {

        // reply to the interaction
		interaction.deferUpdate();

        // perform interaction actions
        interaction.channel.delete();
    },
};