const { MessageEmbed } = require("discord.js");

module.exports = {

	name: 'ping',
	aliases: '',
	description: 'The ping command!',
	usage: '',
	requiredPermissions: '',

	args: false,
	needsTaggedUser: false,
	needsPermissions: false,
	guildOnly: false,
	developerOnly: false,

	execute(message) {

        if (!message.member.nickname) {
            uName = message.author.username;
        } else {
            uName = message.member.nickname;
		}

		const pingEmbed = new MessageEmbed()
			.setAuthor('Wall-E Ping Command', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
			.setTitle(`🏓 Pong!`)
			.setColor(`ABD1C9`)
			.setDescription(`Client Ping: ${Date.now()-message.createdTimestamp}ms.\nAPI Latency: ${message.client.ws.ping}ms`)
			.setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

		message.channel.send(pingEmbed)

		// message.channel.send('https://thumbs.gfycat.com/InfatuatedIllfatedAltiplanochinchillamouse-size_restricted.gif')
	},
};