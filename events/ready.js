module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.clear();
		console.log(`Wall-E is online! Logging in as ${client.user.tag}`);
    	client.user.setActivity(`rohan write bad code`, { type: `WATCHING` })
	},
};