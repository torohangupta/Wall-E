module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Global events loaded`);
	},
};