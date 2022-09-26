module.exports = {

	name: `ready`,
	once: true,

	execute(client) {
		console.log(`${client.user.tag} is online!`);

		// set activity
		const presenceConfig = client.config.PRESENCE;
		client.user.setActivity(presenceConfig.MESSAGE, { type: presenceConfig.TYPE });

		// register slash commands
		client.registerSlashCommands(client, `./utils/commandsStructure`);
	},
};