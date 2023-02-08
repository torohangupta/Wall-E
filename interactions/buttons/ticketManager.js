const fs = require(`fs`);
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {

    id: `ticketManager`,

    execute(client, interaction, args) {

        switch (args) {
            case `create`:
                createTicket(client, interaction);
                break;
            case `cancel`:
                cancelTicket(client, interaction);
                break;
            case `open`:
                openTicket(client, interaction);
                break;
            case `close`:
                closeTicket(client, interaction);
                break;
        }
    }
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
async function createTicket(client, interaction) {

    const member = interaction.member;
    const buttonUser = member.user;

    // get scrubbed username or set to ID if no a-z characters are detected
    const scrubbedUsername = usernameScrubbed(buttonUser);

    // determine if the user has a ticket open already or not
    const textChannels = member.guild.channels.cache.filter(channel => channel.type === `GUILD_TEXT` && channel.name.includes(`ticket`)).map(c => c.name);

    // only allow one ticket to be open at a time
    if (textChannels.includes(`ticket-${scrubbedUsername}`)) {
        return interaction.reply({ content: `You already have a ticket open! Please close that ticket before opening a new one!`, ephemeral: true });
    } else {
        // reply to the interaction
        interaction.deferUpdate();
    }

    // create embed with instructions and buttons
    const ticketEmbed = client.embedCreate({
        title: `Open a Ticket!`,
        description: `To continue with opening a new ticket, please press the "📝 Continue" button and a moderator will be able to help you shortly. If this was a mistake, simply close the ticket by clicking the "🔒 Close" button.`,
        color: `6AA4AD`,
    });

    const ticketOptions = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_cancel')
                .setLabel(`Close`)
                .setStyle('DANGER')
                .setEmoji(`🔒`)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_open')
                .setLabel(`Continue`)
                .setStyle('SUCCESS')
                .setEmoji(`📝`)
        )

    // create the support ticket channel, ping the user & delete the message and then send the ticket introduction
    const supportTicketChannel = await interaction.member.guild.channels.create(`ticket-${scrubbedUsername}`, {
        type: 'GUILD_TEXT',
        parent: interaction.channel.parentId,
        permissionOverwrites: [
            {
                id: interaction.channel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: client.config.ROLES.MOD, // Supreme Overseers
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: buttonUser.id,
                allow: ['VIEW_CHANNEL'],
                deny: [`SEND_MESSAGES`]
            },
        ],
    });
    await supportTicketChannel.send(`<@${buttonUser.id}>`).then(m => m.delete());
    await supportTicketChannel.send({ embeds: [ticketEmbed], components: [ticketOptions] });
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
 function cancelTicket(client, interaction) {
    // reply to the interaction
    interaction.deferUpdate();

    // perform interaction actions
    interaction.channel.delete();
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
async function openTicket(client, interaction) {
    // reply to the interaction
    interaction.deferUpdate();

    // allow the ticket requester to send messages & mods to view the ticket
    interaction.channel.permissionOverwrites.create(interaction.user, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
    interaction.channel.permissionOverwrites.create(client.config.ROLES.MOD, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

    // send the ping and then clear the channel
    interaction.channel.send(`@here`).then(msg => msg.delete());
    const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
    await interaction.channel.bulkDelete(fetchedMessages);

    // generate & send the ticket embed
    const ticketAcceptConfirmedEmbed = client.embedCreate({
        title: `Support Ticket - ${interaction.user.username.toLowerCase().replace(/[^a-z]+/g, '')}`,
        description: `Thank you for reaching out! Please let us know\nhow we can help and a mod will be with you ASAP!\n\nTo recieve a transcript of your ticket, make sure you\nallow direct messages from server members.`,
        color: `6AA4AD`,
    });
    interaction.channel.send({ embeds: [ticketAcceptConfirmedEmbed] });
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
async function closeTicket(client, interaction) {
    // reply to the interaction
    if (!interaction.member._roles.includes(client.config.ROLES.MOD)) {
        return interaction.reply({ content: `Only moderators can mark a ticket as completed!`, ephemeral: true });
    } else interaction.deferUpdate();

    // create vars
    let messageTranscript = [];
    const fileName = `${interaction.channel.name.replace(`ticket`, `transcript`)}.txt`
    var transcriptFileLocation = `./utils/transcripts/${fileName}`;

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
    ticketMembers = interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(client.config.ROLES.MOD) || member._roles.includes(client.config.ROLES.BOT)));

    // create embed
    const transcriptEmbed = client.embedCreate({
        title: `Online College - Support Ticket Transcript`,
        description: `User(s): ${ticketMembers.join(`, `)}`,
        color: `6AA4AD`,
        footer: {
            text: `Powered by Wall-E`,
            iconURL: client.config.IMAGE.SQUARE
        },
        timestamp: true,
    });

    // try to send transcript to all user(s) involved, then send logs in the transcript logging channel
    try {
        // rewrite embed description send transcript to user(s) in ticket
        transcriptEmbed.addFields({
            name: `\u200B`,
            value: `Below is a copy of the support ticket! Feel free to reach out if you have any questions!`
        });
        await ticketMembers.forEach(member => {
            member.user.send({ embeds: [transcriptEmbed] }).then(member.user.send({ files: [transcriptFileLocation] }));
        });

    } catch (err) {
        client.logger.console(`ERROR`, `${err.name}: TicketManager - closeTicket`, err.cause, err.stack);

    } finally {
        // send transcript to transcript logging channel
        interaction.client.channels.cache.get(client.config.CHANNELS.LOG_SUPPORT).send({
            embeds: [transcriptEmbed.spliceFields(0, 1)]
        }).then(interaction.client.channels.cache.get(client.config.CHANNELS.LOG_SUPPORT).send({ files: [transcriptFileLocation] }));

        // delete the support ticket
        interaction.channel.delete();
    }
}

/**
 * Helper function to get the scrubbed user's username OR userID to be used in the ticket channels
 * @param {Object} user A Discord user object
 * @returns {String} Scrubbed username OR userID
 */
function usernameScrubbed(user) {
    // get scrubbed username or set to ID if no a-z characters are detected
    let usernameScrubbed = user.username.toLowerCase().replace(/[^a-z]+/g, '');
    if (usernameScrubbed === ``) { usernameScrubbed = user.id; }

    return usernameScrubbed;
}