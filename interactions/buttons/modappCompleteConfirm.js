const fs = require(`fs`);
const { MessageEmbed } = require(`discord.js`);

module.exports = {

    id: `modappCompleteConfirm`,

    async execute(interaction) {

        // reply to the interaction
        if (!interaction.member._roles.includes(`692097359005351947`)) {
            return interaction.reply({ content: `You can't archive a mod application!`, ephemeral: true });
        } else {
            interaction.deferUpdate();
        }

        // create vars
        var messageTranscript = [];
        var transcriptFileLocation = `./dependencies/modApplications/${interaction.channel.name.replace(`modapp`, `modApplication`)}.txt`;

        // fetch all messages from channel
        const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 })
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
        modApplicant = interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(`692097359005351947`) || member._roles.includes(`692100602297188382`)));

        // create embed
        const transcriptEmbed = new MessageEmbed()
            .setTitle(`Online College - Mod Application Transcript`)
            .setColor(`6aa4ad`)
            .setDescription(`Applicant: ${modApplicant.join(`, `)}`)
            .setTimestamp()
            .setFooter(`Powered by Wall-E`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)


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
            interaction.client.channels.cache.get(`933239367818944592`).send({ embeds: [transcriptEmbed.spliceFields(0,1)] }).then(interaction.client.channels.cache.get(`933239367818944592`).send({ files: [transcriptFileLocation] }));

            // delete the support ticket
            interaction.channel.delete();
        }
    }
};