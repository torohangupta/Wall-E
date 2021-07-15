module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState, client) {
		console.log(oldState)

		// target buttons
		newCommButtons = [`844268130674671646`, `844021820663005204`];
		// order: gamers, WEdev

		// delete channel if eveyone leaves, included OC as blacklisted guild
		try {
			if (oldState.channel.name.includes(`🔊│Comm`) && !oldState.channel.members.size && oldState.guild.id != `692094440881520671`) {
				oldState.channel.delete();
			}
		} catch {
			console.log(`Caught an error... probably a user joining a comm and the old state being null... nothing to worry about!`);
		}

		// create a new voice channel with the proper position when the "create new channel button" is clicked
		if (newCommButtons.includes(newState.channelID)) {

			// get all voice channnels in the guild with type `voice` and name inluding `🔊│Comm`
			var voiceChannels = newState.guild.channels.cache.filter(c => c.type === `voice` && c.name.includes(`🔊│Comm`)).map(c => c.name);
			
			for (let i = 1; i < voiceChannels.length + 2; i++) {				
				if (!voiceChannels.includes(`🔊│Comm ` + i)) {
					newState.guild.channels.create(`🔊│Comm ${i}`, {
						type: 'voice',
						parent: newState.channel.parentID,
						position: newState.channel.rawPosition+i,
						bitrate: 64000
					}).then(vc => {
						newState.channel.members.map(m => m.voice.setChannel(vc.id));
					})
					return;
				}
			}
		}
	},
};
