const { MessageEmbed } = require("discord.js");
const { roleID, channelID, walle } = require(`../dependencies/resources/config.json`)

module.exports = {

	/*
		ONLINE COLLEGE AUTOMOD SCRIPT
		
		Automod Functions
		- Blocks Discord Server Invites
		- Prevents users who have been in the server < 7 days from posting links to external sources
	*/

	execute(message) {

		// run automod functions
		discordLinks(message); // blocks all discord invite links
		links(message); // blocks new users posting links to external sources

	
		function discordLinks(message) {
			// regex to match discord server invites
			const invRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/;

			// get all user roles to check against whitelisted user roles later
			let userRoles = message.member._roles;
			
			// search for link- if link exists, check roles & channel
			if (message.content.search(invRegex) != -1) {
				if (userRoles.includes(roleID.admin) || userRoles.includes(roleID.mod) || userRoles.includes(roleID.linkRole)) {
					// do nothing, since those are all allowed roles
				} else if (message.channel.name.includes(`ticket`)) {
					// do nothing, since all ticket channels are whitelisted
				} else {
					// isolate invite link text
					let sentLink = message.content.slice(message.content.search(invRegex)).split(/ +/)[0];

					// create embed base
					const discordLinkEmbed = new MessageEmbed()
						.setColor(`E22E2E`) // RED
						.setDescription(`${message.author}, you don't have permission to send a message with a Discord invite link. Please reach out to the mods using the <#866434475495129118> channel if you believe this to be an error.`)
						.setFooter(`Wall-E AutoMod | Discord Invite Link`, walle.iconUrl);

					// send a message to the channel
					message.channel.send({embeds: [discordLinkEmbed]});

					// edit embed to send alert to mod channel
					discordLinkEmbed.setDescription(`An unauthorized user attemped to send a Discord invite link. The message has been deleted.\n\n**User:** ${message.author}\n**Channel:** ${message.channel}\n**Link:** [${sentLink}](${sentLink})\n\n**Full Message:** ${message.content}`);

					// send edited embed notification to mod team
					message.client.channels.cache.get(channelID.modPrivate).send({embeds: [discordLinkEmbed]});

					// delete the offending message
					message.delete();
				}
			}
		}

		function links(message) {
			// regex to match general links
			const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

			let sentLink = message.content.slice(message.content.search(linkRegex)).split(/ +/)[0];

			// get days on server
			const daysOnServer = Math.floor((Date.now() - message.member.joinedTimestamp) / 86400000);

			const linkBlacklistTime = 7; // number of days before you can post links on the server
			if (message.content.search(linkRegex) != -1 && daysOnServer < linkBlacklistTime) {
				// create embed base
				const linkTester = new MessageEmbed()
					.setColor(`E22E2E`) // RED
					.setDescription(`${message.author}, you must be in the server for more than \`${linkBlacklistTime}\` days to post links to external sources. Please reach out to the mods using the <#866434475495129118> channel if you believe this to be an error.`)
					.setFooter(`Wall-E AutoMod | Anti-Links (New Members) `, walle.iconUrl);

			// send a message to the channel
			message.channel.send({embeds: [linkTester]});

			// edit embed to send alert to mod channel
			linkTester.setDescription(`A new user attemped to send a link to an external site. The message has been deleted.\n\n**User:** ${message.author}\n**Channel:** ${message.channel}\n**Link:** [${sentLink}](${sentLink})\n\n**Full Message:** ${message.content}`);

			// send edited embed notification to mod team
			message.client.channels.cache.get(channelID.modPrivate).send({embeds: [linkTester]});

			// delete the offending message
			message.delete();
			}
		}
	}
};