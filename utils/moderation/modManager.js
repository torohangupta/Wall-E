const discordLinksRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/;
const webLinksRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

/**
 * The general automod function. Calls all subfunctions to ensure messages sent follow server rules
 * @param {Client} client The active BotClient instance
 * @param {Object} message Message object emitted on MessageCreate event
 */
function automod(client, message) {

    // destructure components and get relevant vars
    const { member, channel } = message;
    const userRoles = member._roles;
    const serverRoles = client.config.ROLES;
    let function_result; // if the automod ever trips, end function execution immediately

    // ignore if user is a mod or in a ticket/modapp channel
    if (userRoles.includes(serverRoles.MOD)) return;
    if (channel.name.includes(`ticket`)) return;
    if (channel.name.includes(`modapp`)) return;

    // run the automod functions
    function_result = discordLinks(client, message);
    if (function_result) return;
    function_result = newMemberLinks(client, message);
    if (function_result) return;
}

/**
 * Function to ensure messages sent do not contain discord links
 * @param {Client} client The active BotClient instance
 * @param {Object} message Message object emitted on MessageCreate event
 */
function discordLinks(client, message) {

    // destructure vars
    const { content, author, member, channel } = message;
    const config = client.config;

    // return if the message does not contain a discord link
    if (content.search(discordLinksRegex) === -1) return false;

    // get the sent link
    const link = content.slice(content.search(discordLinksRegex)).split(/ +/)[0];

    // log to console & console channel
    client.logger.console({
        level: `INFO`,
        title: `Automod - Discord Links`,
        message: [
            `${member.user.tag} sent a message with a Discord link`,
            `Link: ${link}`
        ],
    });

    // create the embed to send
    const embed = client.embedCreate({
        description: `${author}, you don't have permission to send a message with a Discord invite link. Please reach out to the mods using the <#${config.CHANNELS.CONTACT_MODS}> channel if you believe this to be an error.`,
        color: `E22E2E`,
        footer: {
            text: `Wall-E AutoMod | Discord Invite Link`,
            iconURL: config.IMAGE.SQUARE
        },
        timestamp: true,
    })

    // send a message to the channel
    channel.send({ embeds: [embed] });

    // change embed for mods and send updated message
    embed.setDescription(`An unauthorized user attemped to send a Discord invite link. The message has been deleted.\n\n**User:** ${author}\n**Channel:** ${channel}\n**Link:** [${link}](${link})\n\n**Full Message:** ${content}`);

    client.channels.cache.get(config.CHANNELS.LOG_AUTOMOD).send({ embeds: [embed] });

    // finally, delete the message
    message.delete();
    return true;
}

/**
 * Function to ensure messages sent do not contain discord links
 * @param {Client} client The active BotClient instance
 * @param {Object} message Message object emitted on MessageCreate event
 */
function newMemberLinks(client, message) {

    // destructure vars
    const { content, author, member, channel } = message;
    const config = client.config;
    const daysOnServer = Math.floor((Date.now() - member.joinedTimestamp) / 86400000);
    const linkBlacklistTime = 7; // days

    // return if the message does not contain a link or the member has been in the server for longer than [linkBlacklistTime] days
    if (daysOnServer > linkBlacklistTime) return false;
    if (content.search(webLinksRegex) === -1) return false;

    // get the sent link
    const link = content.slice(content.search(webLinksRegex)).split(/ +/)[0];

    // log to console & console channel
    client.logger.console({
        level: `INFO`,
        title: `Automod - Web Links`,
        message: [
            `${member.user.tag} sent a message containing a link to an external website`,
            `Link: ${link}`
        ],
    });

    // create the embed to send
    const embed = client.embedCreate({
        description: `${author}, you must be in the server for more than \`${linkBlacklistTime}\` days to post links to external sources. Please reach out to the mods using the <#${config.CHANNELS.CONTACT_MODS}> channel if you believe this to be an error.`,
        color: `E22E2E`,
        footer: {
            text: `Wall-E AutoMod | External Links (New Members)`,
            iconURL: config.IMAGE.SQUARE
        },
        timestamp: true,
    })

    // send a message to the channel
    channel.send({ embeds: [embed] });

    // change embed for mods and send updated message
    embed.setDescription(`A new user attemped to send a link to an external site. The message has been deleted.\n\n**User:** ${author}\n**Channel:** ${channel}\n**Link:** [${link}](${link})\n\n**Full Message:** ${content}`);

    client.channels.cache.get(config.CHANNELS.LOG_AUTOMOD).send({ embeds: [embed] });

    // finally, delete the message
    message.delete();
    return true;
}

module.exports = { automod };