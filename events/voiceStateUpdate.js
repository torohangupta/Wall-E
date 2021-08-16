module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState, client) {

		// new voice channel button
		const newVoiceButton = `874318897422159872`;

		// all instances of deleting a channel
		try {
			let emptyChannelCheck = oldState.channel.name.includes(`🔊│Comm`) && !oldState.channel.members.size;

			// condition: user leaves a channel as the last user in the channel to create a new one
			if (emptyChannelCheck && newState.channelId === newVoiceButton) {
				await oldState.channel.delete();
				let voiceChannels = await newState.guild.channels.cache.filter(c => c.type === `GUILD_VOICE` && c.name.includes(`🔊│Comm`)).map(c => c.name);
				return await voiceCreate(voiceChannels, newState);

			// confition: user leaves a channel as the last user in the channel
			} else if (emptyChannelCheck) {
				return await oldState.channel.delete();
			}

		} catch (error) {
			console.log(`Caught an error - probably a user joining a channel & the old state being null`)
		} // catch oldState.channelId === null (user coming joining channel at first instance)

		// create channel if user clicks the "button" to create a new channel
		if (newState.channelId == newVoiceButton) {
			let voiceChannels = await newState.guild.channels.cache.filter(c => c.type === `GUILD_VOICE` && c.name.includes(`🔊│Comm`)).map(c => c.name);
			return await voiceCreate(voiceChannels, newState);
		}


		// function to create voice channels
		async function voiceCreate(voiceChannels, newState) {
			/*
			Inputs:
				voiceChannels : Array of VCs in the server where the name of the VC includes `🔊│Comm`
				newState : from voiceStateUpdate event, the user's newState
			*/

			// loop to determine open channel name
			for (let i = 1; i < voiceChannels.length + 2; i++) {
				if (!voiceChannels.includes(`🔊│Comm ` + i)) {

					let newVoice = await newState.guild.channels.create(`🔊│Comm ${i}`, {
						type: 'GUILD_VOICE',
						parent: newState.channel.parentId,
						position: newState.channel.rawPosition + i,
						bitrate: 64000
					});

					return await newState.channel.members.map(m => m.voice.setChannel(newVoice.id));
				}
			}
		}
	}
};