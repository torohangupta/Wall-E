const { automod } = require(`../utils/moderation/modManager.js`)

module.exports = {

	name: `messageCreate`,
	once: false,

	execute(client, message) {

		/** MessageCreate Event
		 * @param {Client} client The active BotClient instance
		 * @param {Object} message Message object emitted on MessageCreate
		 * 
		 * @todo 		Better DM handling to include files/attachments and images
		 * @planning 	Rewrite of automod & it's functions
		 * @feature 	Create DM channel as "support" style ticket
		 */

		if (message.channel.type === `DM`) return client.logger.dm(message.author, message);

		if (message.author.bot) return;
		automod(client, message)
	},
};