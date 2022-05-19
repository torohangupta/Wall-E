module.exports = {

	name: 'antiInvite',
	regex: /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g,

	execute(message) {

        const discRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
		const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

		const guildMember = message.member;
		

		if (message.content.search(linkRegex) != -1) {
			message.channel.send("that's a link")
		}


		console.log(message.content.search(linkRegex))
        console.log("here")
	}

	function discordLinks(message, guildMember) {

		// get account age
		const accountAge = Math.floor((Date.now() - Date(guildMember.user.createdAt)) / 86400000);

		// regex to match discord server invites
		const invRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
	}
};