const fs = require(`fs`);
const { MessageEmbed } = require(`discord.js`);
const { roleID, channelID, walle } = require(`../../dependencies/resources/config.json`);

module.exports = {

    id: `modappArchiveConfirm`,

    async execute(interaction) {

        // reply to the interaction
        if (!interaction.member._roles.includes(roleID.mod)) {
            return interaction.reply({ content: `I'm sorry, only moderators can archive an application!`, ephemeral: true });
        } else {
            interaction.deferUpdate();
        }

        // create vars
        var messageTranscript = [];
        var transcriptFileLocation = `./dependencies/modApplications/${interaction.channel.name.replace(`modapp`, `modApplication`)}.txt`;

        // fetch all messages from channel
        var fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 })
        fetchedMessages.forEach(msgObject => {
            // log the messages sent in the channel
            if (msgObject.embeds[0]) {
                messageTranscript.push(`${msgObject.author.username} - [Message Embed]`);
            } else if (msgObject.attachments.map(a => a)[0]) {
                messageTranscript.push(`${msgObject.author.username} - [Message Attachment]`);
            } else {
                messageTranscript.push(`${msgObject.author.username} - ${msgObject.content}`);
            }
        });

        // reverse transcript array and write to file
        messageTranscript = messageTranscript.reverse().join(`\n`);
        attachment = fs.writeFile(transcriptFileLocation, messageTranscript, (err) => {
            if (err) throw err;
            console.log('Application transcript was created successfully.');
        });

        // get all members of the channel who aren't a supreme overseer || bot
        modApplicant = interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(roleID.mod) || member._roles.includes(roleID.bots)));

        // create embed
        const transcriptEmbed = new MessageEmbed()
            .setTitle(`Online College - Mod Application Transcript`)
            .setColor(`6aa4ad`)
            .setDescription(`Applicant: ${modApplicant.join(`, `)}`)
            .setTimestamp()
            .setFooter(`Powered by Wall-E`, walle.iconUrl)


        // try to send transcript to all user(s) involved, then send logs in the transcript logging channel
        try {
            // rewrite embed description send transcript to user(s) in ticket
            transcriptEmbed.addFields({ name: `\u200B`, value: `Below is a copy your application! Feel free to reach out if you have any questions!`});
            modApplicant.forEach(member => {
                member.user.send({ embeds: [transcriptEmbed] }).then(member.user.send({ files: [transcriptFileLocation] }));
            });

        } catch (error) {
            console.log(error)

        } finally {
            // send transcript to transcript logging channel
            interaction.client.channels.cache.get(channelID.logModapp).send({ embeds: [transcriptEmbed.spliceFields(0,1)] }).then(interaction.client.channels.cache.get(channelID.logModapp).send({ files: [transcriptFileLocation] }));

            // delete the support ticket
            interaction.channel.delete();
        }
    }
};