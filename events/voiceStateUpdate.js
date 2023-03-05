module.exports = {

	name: `voiceStateUpdate`,
	once: false,

	async execute(client, oldState, newState) {
		// get new voice button from config
		const newVoiceChannelButton = client.config.NEW_VOICE_CHANNEL_BUTTON;

		// determine if the oldState was a channel to be deleted
		let emptyChannelCheck = oldState.channelId === null ? undefined :
			oldState.channel.name.includes(`🔊│Comm`) && !oldState.channel.members.size;

		// if oldState has no users remaining, remove it
		if (emptyChannelCheck) await voiceDelete(client, oldState);

		// user requests a new voice channel
		if (newState.channelId === newVoiceChannelButton) return await voiceCreate(client, newState);
	}
};

/**
 * Function to create a new voice channel
 * @param {Client} client active BotClient instance
 * @param {Object} voiceState voiceState object
 */
async function voiceCreate(client, voiceState) {

	// get array of voiceChannels
	const voiceChannelArray = voiceState.guild.channels.cache
		.filter(c => c.name.includes(`🔊│Comm`))
		.map(c => c.name);

	for (let i = 1; i < voiceChannelArray.length + 2; i++) {
		if (voiceChannelArray.includes(`🔊│Comm ` + i)) continue;

		const newVoiceChannel = await voiceState.guild.channels.create(`🔊│Comm ${i}`, {
			type: 'GUILD_VOICE',
			parent: voiceState.channel.parentId,
			position: voiceState.channel.rawPosition + i,
			bitrate: 64000,
		});

		await voiceState.channel.members.map(m => m.voice.setChannel(newVoiceChannel.id));
		return await client.logger.console({
            level: `INFO`,
            title: `Event - voiceStateUpdate`,
            message: [`${newVoiceChannel.name} was created`]
        });
	}
}

/**
 * Function to remove a voice channel
 * @param {Client} client active BotClient instance
 * @param {Object} voiceChannel voiceState object
 */
async function voiceDelete(client, voiceChannel) {
	await client.logger.console(`INFO`, `Event - voiceStateUpdate`, `${voiceChannel.channel.name} was removed`);
	await voiceChannel.channel.delete();
	return;
}