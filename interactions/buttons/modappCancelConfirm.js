module.exports = {
    
    id: `modappCancelConfirm`,

    execute(interaction) {

        // reply to the interaction
		interaction.deferUpdate();

        // perform interaction actions
        interaction.channel.delete();
    },
};