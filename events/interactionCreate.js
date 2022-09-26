module.exports = {

	name: `interactionCreate`,
	once: false,

	async execute(client, interaction) {

		try {
			if (interaction.isCommand()) {
				const command = client.slashCommands.get(interaction.commandName);
				if (command) await command.execute(interaction);
				else throw new ReferenceError(`Cannot find the interaction command file!`, { cause: `File is either missing or does not exist.` })
			}
		} catch (err) {
			console.log(err.level)
		}
		

		// try {
		// 	// if (interaction.isCommand()) {
		// 	// 	const slashCommand = client.slashCommands.get(interaction.commandName);

		// 	// 	try {
		// 	// 		await slashCommand.execute(interaction);
		// 	// 	} catch (error) {
		// 	// 		throw new Error(`Failed to Execute InteractionCommand`, { cause: error.message });
		// 	// 	}
		// 	// } else 
		// 	if (interaction.isButton()) {
		// 		const buttonIDComponent = interaction.customId.split(`_`);

		// 		switch (buttonIDComponent.length) {
		// 			case 1: // button is not part of a managed set
		// 				console.log(`NO BUTTON MANAGER`);
		// 				break;
		// 			case 2: // button is part of a managed set (second arg is function)
		// 				console.log(`BUTTON MANAGER`);
		// 				console.log(`${buttonIDComponent[0]}Manager.js`)
		// 				break;

		// 			default:
		// 				throw new Error(`Failed to Execute InteractionCommand`, { cause: error.message });
		// 		}

		// 	} else if (interaction.isSelectMenu()) {

		// 	} else {
		// 		throw new Error('Interaction does not exist!', { cause: `err` });
		// 	}
		// } catch (err) {
		// 	// interaction.reply({ content: `That doesn't work currently. If you think this is a mistake, please submit a bug report on my GitHub!\nhttps://github.com/torohangupta/Wall-E`, ephemeral: true });  
		// 	console.log(`===============================================`);
		// 	console.log(err.message)
		// 	console.log(`===============================================`);
		// 	console.log(err.cause)
		// 	console.log(`===============================================`);
		// 	console.log(err.stack)
		// 	console.error(`${err.name}: ${err.message}`);
		// }
	}
};