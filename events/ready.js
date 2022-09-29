module.exports = {

	name: `ready`,
	once: true,

	async execute(client) {
		client.logger.console(`INFO`, `${client.user.tag} is online!`);

		// set activity
		const presenceConfig = client.config.PRESENCE;
		client.user.setActivity(presenceConfig.MESSAGE, { type: presenceConfig.TYPE });

		// register slash commands
		client.registerSlashCommands(client, `./utils/commandsStructure`);

		// pass active BotClient to logger & then initialize the logger class
		client.logger.client = client;
		client.logger.init();
	},
};