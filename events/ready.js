const { PRESENCE } = require(`../core/config.js`)

module.exports = {

	name: `ready`,
	once: true,

	execute(client) {
		// clear console
		// console.clear();
		console.log(`${client.user.tag} is online!`);

    	client.user.setActivity(PRESENCE.MESSAGE, { type: PRESENCE.TYPE });

	},
};