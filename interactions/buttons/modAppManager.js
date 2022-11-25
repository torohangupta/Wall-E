const fs = require(`fs`);
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {

    id: `modappManager`,

    execute(client, interaction, args) {
        switch (args) {
            case `create`:
                createModapp(client, interaction);
                break;
            case `cancel`:
                cancelModapp(client, interaction);
                break;
            case `submit`:
                submitModapp(client, interaction);
                break;
            case `archive`:
                archiveModapp(client, interaction);
                break;
        }
    }
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
async function createModapp(client, interaction) {

    const member = interaction.member;
    const buttonUser = member.user;

    // get scrubbed username or set to ID if no a-z characters are detected
    let scrubbedUsername = usernameScrubbed(buttonUser);

    // determine if the user has a modapp open already or not
    const textChannels = member.guild.channels.cache.filter(channel => {
        channel.type === `GUILD_TEXT` && channel.name.includes(`modapp`)
    }).map(c => c.name);

    // only allow one modapp to be open at a time
    if (textChannels.includes(`modapp-${scrubbedUsername}`)) {
        return interaction.reply({ content: `You already have a modapp open! Please complete that application!`, ephemeral: true });
    } else {
        // reply to the interaction
        interaction.deferUpdate();
    }

    // create embed with instructions and buttons
    const modappEmbed = client.embedCreate({
        title: `Join the moderation team!`,
        description: `Thank you for your interest in joining the moderation team! Please answer the questions below, review the <#798764172929662996> and then click the \`✔️ Submit\` to submit your application. If this was a mistake, simply cancel your application by clicking the \`🔒 Cancel\` button.\n\n**General Questions**\n> 1. What is your name? (Optional)\n> 2. What year are you?\n> 3. What is your major?\n\n**Application Questions:**\n> 1. Why do you want to be a part of the moderation team?\n> 2. How familar are you with Discord & using Discord bots?\n> 3. How familiar are you with Iowa State, campus, etc.?\n> 4. Do you have any experience that may be relevent to the role?\n\n*Thank you for your interest in joining the moderation team! We'll look at your application as soon as possible. In the meantime, feel free to share your favorite meme!*`,
        color: `4B6999`,
    });

    const modappEmbedButtons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('modappCancel')
                .setLabel(`Cancel Application`)
                .setStyle('DANGER')
                .setEmoji(`🔒`)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('modappSubmit')
                .setLabel(`Submit Application`)
                .setStyle('SUCCESS')
                .setEmoji(`✔️`)
        )

    // create the support ticket channel, ping the user & delete the message and then send the ticket introduction
    const modappChannel = await member.guild.channels.create(`modapp-${scrubbedUsername}`, {
        type: 'GUILD_TEXT',
        parent: interaction.channel.parentId,
        permissionOverwrites: [
            {
                id: interaction.channel.guild.roles.everyone,
                deny: [`VIEW_CHANNEL`],
            },
            {
                id: client.config.ROLES.MOD, // Server Mod Role ID
                deny: [`VIEW_CHANNEL`],
            },
            {
                id: buttonUser.id,
                allow: [`SEND_MESSAGES`, `VIEW_CHANNEL`],
            },
        ],
    });
    await modappChannel.send(`<@${buttonUser.id}>`).then(m => m.delete());
    await modappChannel.send({ embeds: [modappEmbed], components: [modappEmbedButtons] });
}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
function cancelModapp(client, interaction) {
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
async function submitModapp(client, interaction) {
    // fetch all messages from channel
    var fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });

    // check count of messages in the channel that the user has sent. If the user has not sent any messages, they can't submit their application => reply to interaction either way
    const userMessageCount = fetchedMessages.filter(message => message.author.id !== client.config.WALLE_ID);
    if (userMessageCount === 0) return interaction.reply({ content: `Please complete the application before submitting it!`, ephemeral: true });
    else interaction.deferUpdate();

    var applicationEmbed = await interaction.channel.messages.fetch({ limit: 100 });
    var cachedMessages = applicationEmbed.map(m => m)
    cachedMessages[cachedMessages.length - 1].edit({ components: [] });

    // get scrubbed username or set to ID if no a-z characters are detected
    let scrubbedUsername = usernameScrubbed(buttonUser);

    // perform interaction actions
    interaction.channel.permissionOverwrites.create(interaction.user, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
    interaction.channel.permissionOverwrites.create(roleID.mod, { VIEW_CHANNEL: true, SEND_MESSAGES: true });


    // Create successful submit & user profile embeds
    const modappSubmittedEmbed = client.embedCreate({
        title: `Moderator Application - ${scrubbedUsername}`,
        description: `Thank you for submitting your application! We appreciate the time you spent and we'll be in touch soon! To get a transcript of your application, please make sure you have DMs from server members enabled.`,
        color: `4B6999`,
    });
    const userProfileEmbed = userProfile(client, interaction);

    // create archive button
    const modappArchiveButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('modapp_archive')
                .setLabel(`Archive Application`)
                .setStyle('SECONDARY')
                .setEmoji(`💾`)
        )

    // send notification to mod team
    interaction.client.channels.cache.get(client.config.CHANNELS.MOD_PRIVATE).send({ content: `A new moderator application was submitted!` });// send confirmation embed
    interaction.channel.send({ embeds: [modappSubmittedEmbed, userProfileEmbed], components: [modappArchiveButton] });

}

/**
 * 
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 */
async function archiveModapp(client, interaction) {
    // reply to the interaction
    if (!interaction.member._roles.includes(client.config.ROLES.MOD)) {
        return interaction.reply({ content: `I'm sorry, only moderators can archive an application!`, ephemeral: true });
    } else interaction.deferUpdate();

    // create vars
    let messageTranscript = [];
    const fileName = `${interaction.channel.name.replace(`modapp`, `transcript`)}.txt`
    const transcriptFileLocation = `./utils/transcripts/${fileName}`;

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
    const modApplicant = interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(roleID.mod) || member._roles.includes(roleID.bots))) ? interaction.member : interaction.channel.members.map(m => m).filter(member => !(member._roles.includes(roleID.mod) || member._roles.includes(roleID.bots)));

    // create embed
    const transcriptEmbed = client.embedCreate({
        title: `Online College - Mod Application Transcript`,
        description: `Applicant: ${modApplicant}`,
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
            value: `Below is a copy your application! Feel free to reach out if you have any questions!`
        });
        await modApplicant.user.send({ embeds: [transcriptEmbed] })
        await modApplicant.user.send({ files: [transcriptFileLocation] });

    } catch (err) {
        client.logger.console(`ERROR`, `${err.name}: ModappManager - archiveModapp`, err.cause, err.stack);

    } finally {
        // send transcript to transcript logging channel
        interaction.client.channels.cache.get(client.config.CHANNELS.LOG_MODAPPS).send({
            embeds: [transcriptEmbed.spliceFields(0, 1)]
        }).then(interaction.client.channels.cache.get(client.config.CHANNELS.LOG_MODAPPS).send({ files: [transcriptFileLocation] }));

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

/**
 * Helper function to get user information
 * @param {Client} client initialized client
 * @param {Object} interaction emitted interaction object
 * @returns {Embed}
 */
function userProfile(client, interaction) {
    // if there is a tagged user, use that, otherwise use the interaction author
    const guildMember = interaction.member;
    const guildUser = guildMember.user;
    const guildNickname = guildMember.nickname ? guildMember.nickname : guildMember.user.username;
    const guildUserAvatar = guildUser.displayAvatarURL({ format: "png", dynamic: true });

    // get the member's roles
    const allUserRoles = guildMember.roles.cache.sort((a, b) => b.position - a.position).map(r => r);
    const serverRoles = allUserRoles.slice(0, allUserRoles.length - 1).join(`, `);

    // get account join information & convert to date, time & days elapsed
    const discordJoinDate = new Date(guildMember.user.createdAt)
    const discordDateJoined = discordJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
    const discordTimeJoined = discordJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
    const accountAge = Math.floor((Date.now() - discordJoinDate) / 86400000);

    // get user's server join information & convert to date, time & days elapsed
    const serverJoinDate = new Date(guildMember.joinedTimestamp)
    const serverDateJoined = serverJoinDate.toLocaleString(`en-US`, { month: "long", day: "numeric", year: "numeric" });
    const serverTimeJoined = serverJoinDate.toLocaleString(`en-US`, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
    const daysOnServer = Math.floor((Date.now() - serverJoinDate) / 86400000);

    return client.embedCreate({
        author: { name: `User Profile: ${guildNickname}`, iconURL: guildUserAvatar },
        description: `\n**User Tag:** <@!${guildUser.id}>\n\n**Server Roles:** ${serverRoles}`,
        fields: [
            { name: `\u200B`, value: `**Joined Discord:**\n${discordDateJoined}\n${discordTimeJoined}\nAccount Age: ${accountAge} Days`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: `\u200B`, value: `**Joined ${interaction.guild}:**\n${serverDateJoined}\n${serverTimeJoined}\nTime on Server: ${daysOnServer} Days`, inline: true }
        ],
        color: `4B6999`,
        footer: { text: `Application submitted` },
        timestamp: true,
    });
}