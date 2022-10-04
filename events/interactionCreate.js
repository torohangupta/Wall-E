const Logger = require(`../core/logger.js`);

module.exports = {

	name: `interactionCreate`,
	once: false,

	async execute(client, interaction) {

		// client.logger.test();
		

		try {
			if (interaction.isCommand()) {
				// check for guild only commands

				const command = client.slashCommands.get(interaction.commandName);
				if (command) await command.execute(interaction), client.logger.console(`INFO`, `Event - ${this.name}`, `${interaction.user.tag} ran the ${interaction.commandName} command`);
				else throw new ReferenceError(`Cannot find the interaction command file!`, { cause: `File is either missing or does not exist.` });

			} else if (interaction.isButton()) {
				const buttonIDComponent = interaction.customId.split(`_`);
				let buttonID, button;

				switch (buttonIDComponent.length) {
					case 1: // button is not part of a managed set
						buttonID = buttonIDComponent;
						button = client.buttons.get(buttonID);
						break;

					case 2: // button is part of a managed set (second arg is function)
						buttonID = `${buttonIDComponent[0]}Manager`;
						button = client.buttons.get(buttonID);
						break;

					default:
						throw new ReferenceError(`Failed to Execute InteractionCommand`, { cause: `File is either missing or does not exist.` });
				}
				args = (buttonIDComponent[1] ? [client, interaction, buttonIDComponent[1]] : [client, interaction]);

				if (button) await button.execute(...args), client.logger.console(`INFO`, `Event - ${this.name}`, `${interaction.user.tag} clicked on the ${buttonID} button`);
				else throw new ReferenceError(`Cannot find the interaction button file!`, { cause: `File is either missing or does not exist.` });

			} else if (interaction.isSelectMenu()) {

			} else {
				throw new Error()
			}
		} catch (err) {
			client.logger.console(`ERROR`, `${err.name}: Event - ${this.name}`, err.cause, err.stack);
		}
	}
};