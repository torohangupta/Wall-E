const fs = require(`fs`);
const { MessageEmbed } = require(`discord.js`);

module.exports = {

    id: `ticketCloseConfirm`,

    async execute(interaction) {

        // reply to the interaction
        if (!interaction.member._roles.includes(`692097359005351947`)) {
            return interaction.reply({ content: `You can't mark a ticket as completed!`, ephemeral: true });
        } else {
            interaction.deferUpdate();
        }

        // create vars
        var messageTranscript = [];
        var transcriptFileLocation = `./release_oc/supportTranscripts/${interaction.channel.name.replace(`ticket`, `transcript`)}.txt`;

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
            console.log('Transcript file is created successfully.');
        });

        // get all members of the channel who aren't a supreme overseer || bot
        ticketMembers = interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(`692097359005351947`) || member._roles.includes(`692100602297188382`)));

        // create embed
        const transcriptEmbed = new MessageEmbed()
            .setTitle(`Online College - Support Ticket Transcript`)
            .setColor(`6aa4ad`)
            .setDescription(`User(s): ${ticketMembers.join(`, `)}`)
            .setTimestamp()
            .setFooter(`Powered by Wall-E`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)


        // try to send transcript to all user(s) involved, then send logs in the transcript logging channel
        try {
            // rewrite embed description send transcript to user(s) in ticket
            transcriptEmbed.addFields({ name: `\u200B`, value: `Below is a copy of the support ticket! Feel free to reach out if you have any questions!`});
            ticketMembers.forEach(member => {
                member.user.send({ embeds: [transcriptEmbed] }).then(member.user.send({ files: [transcriptFileLocation] }));
            });

        } catch (error) {
            console.log(error)

        } finally {
            // send transcript to transcript logging channel
            interaction.client.channels.cache.get(`789907442582028308`).send({ embeds: [transcriptEmbed.spliceFields(0,1)] }).then(interaction.client.channels.cache.get(`789907442582028308`).send({ files: [transcriptFileLocation] }));

            // delete the support ticket
            interaction.channel.delete();
        }
    }
};