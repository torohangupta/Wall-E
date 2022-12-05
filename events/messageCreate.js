module.exports = {

	name: `messageCreate`,
	once: false,

	execute(client, message) {
		if (message.channel.type === `DM`) return client.logger.dm(message.author, message);
		// TODO: Handle messageCreate event
	},
};