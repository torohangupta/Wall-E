module.exports = {

    name: `interactionCreate`,
    once: false,

    async execute(client, interaction) {
        // client.logger.test();

        try {
            if (interaction.isCommand()) { return await executeCommand(client, interaction); }
            if (interaction.isButton()) { return await executeButton(client, interaction); }
        } catch (err) {
            client.logger.console(`ERROR`, `${err.name}: Event - ${this.name}`, err.cause, err.stack);
        }
    }
};

/**
 * Function to execute slash commands
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object returned from the interactionCreate event
 */
async function executeCommand(client, interaction) {
    const command = client.slashCommands.get(interaction.commandName);

    if (command) {
        client.logger.console(`INFO`, `Event - interactionCreate`, `${interaction.user.tag} ran the ${interaction.commandName} command`);
        await command.execute(client, interaction);

    } else throw new ReferenceError(`Cannot find the interaction command file!`, { cause: `File is either missing or does not exist.` });
}

/**
 * Function to execute button commands
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object returned from the interactionCreate event
 */
async function executeButton(client, interaction) {
    const buttonIDComponent = interaction.customId.split(`_`);
    let buttonID, button, args;

    switch (buttonIDComponent.length) {
        case 1: // button is not part of a managed set
            buttonID = buttonIDComponent;
            button = client.buttons.get(buttonID);
            args = [client, interaction];
            break;

        case 2: // button is part of a managed set (second arg is function)
            buttonID = `${buttonIDComponent[0]}Manager`;
            button = client.buttons.get(buttonID);
            args = [client, interaction, buttonIDComponent[1]];
            break;
    }

    if (button) {
        client.logger.console(`INFO`, `Event - interactionCreate`, `${interaction.user.tag} clicked on the ${buttonID} button`);
        await button.execute(...args);

    } else throw new ReferenceError(`Cannot find the interaction button file!`, { cause: `File is either missing or does not exist.` });
}
