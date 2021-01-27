const { MessageEmbed } = require("discord.js");
const { consoleChannel, userIDs } = require(`../resources/config.json`)

module.exports = {

    name: `support`,
    aliases: [`support`],
    description: `Use this command to open a support ticket`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: true,
    developerOnly: false,

    execute(message, args) {

        // limit usage to online college
        if (message.member.guild.name != `Online College`) {
            return message.channel.send(`I'm sorry, you can't use this command here. This command was custom written for the **Online College** Discord Server & will not work properly here.`);
        }

        if (args[0] && message.author.id == userIDs.rohan) {
            return console.log(supportCache[message.author.id]);
        }

        transcriptLogChannel = `789907442582028308`;

        // try to access cache, if the cache doesn't exist, create it
        try {
            // try to initialize the cache
            supportCache[message.author.id] = {}

        } catch {
            // if the cache doesn't exist (i.e. first run on startup), create the cache object & log event
            console.log(`Initializing Cache`);
            supportCache = {};

        } finally {
            // create the object
            supportCache[message.author.id] = {
                user: message.author,
                loggingIndex: 0,
                completedMod: null,
                closedMod: null,
                transcriptLog: []
            }
        }

        // Delete passed command & log deletion in console
        message.delete()
            .then(msg => {
                console.log(`Deleted '${msg}' from ${msg.author}`)
                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${msg}\` from \`${msg.author}\``);
            })
            .catch(console.error);

        // check to make sure user doesn't already have a support ticket open
        if (message.guild.channels.cache.find(c => c.name.includes(`${message.author.username}`))) {
            return message.channel.send(`You already have a support ticket open. Please close that one before opening a new one.`);
        }

        // create support text channel for message.author & send messages & create reaction collector. Set support ticket status to waiting for user input/issue.
        message.guild.channels.create(`🔴-support-${message.author.username}`, {
            type: `text`,
            parent: message.guild.channels.cache.find(c => c.name == `Support` && c.type == 'category'),
            permissionOverwrites: [
                {
                    id: message.channel.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: `692097359005351947`, // Supreme Overseers
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: supportCache[message.author.id].user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        }).then(suppportChan => {

            // create message collectors & reaction filters to change the channel indicator to in progress and log messages
            const msgLoggingCollector = suppportChan.createMessageCollector(m => m.channel.name.includes(supportCache[message.author.id].user.username));
            const inProgressCollector = suppportChan.createMessageCollector(m => m.author.id != message.author.id && m.author.id != userIDs.walle, { max: 1 });
            const completedTicketFilter = (reaction, user) => { return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != message.author.id; };
            const closeTicketFilter = (reaction, user) => { return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != supportCache[message.author.id].completedMod.id; }

            // message collector to collect & log messages in cache
            msgLoggingCollector.on(`collect`, m => {

                // log the messages sent in the channel
                if (m.embeds[0]) {
                    supportCache[message.author.id].transcriptLog[supportCache[message.author.id].loggingIndex] = `**${m.author.username}** - [Message Embed]`;
                } else if (m.attachments.map(a => a)[0]) {
                    supportCache[message.author.id].transcriptLog[supportCache[message.author.id].loggingIndex] = `**${m.author.username}** - [Message Attachment]`;
                } else {
                    supportCache[message.author.id].transcriptLog[supportCache[message.author.id].loggingIndex] = `**${m.author.username}** - ${m.content}`;
                }

                // iterate the transcript logging counter
                supportCache[message.author.id].loggingIndex++
            })

            // change support ticket status to being helped
            inProgressCollector.on(`end`, () => {
                suppportChan.setName(`🟠-support-${message.author.username}`)
            })

            // create support embed
            const supportEmbed = new MessageEmbed()
                .setTitle(`New support ticket - ${message.author.username}`)
                .setDescription(`User: ${message.author}\n\nPlease list the issue/problem you're having. Please be as detailed as possible.\nA mod will get back to you ASAP.`)
                .setColor(`FF5733`)
                .setTimestamp()

            // send user tag, embed & react to embed
            suppportChan.send(`@here, ${message.author} has a support ticket!`).then(() => {
                suppportChan.send(supportEmbed).then(supportEmbed => {
                    supportEmbed.react(`❌`);

                    // create reaction collectors
                    const completedTicket = supportEmbed.createReactionCollector(completedTicketFilter, { max: 1 });

                    // reaction collector for completed ticket
                    completedTicket.on(`collect`, (reaction, user) => {
                        // change ticket indicator to completed
                        suppportChan.setName(`🟢-support-${message.author.username}`)

                        // log user who marked ticket as completed
                        supportCache[message.author.id].completedMod = user;

                        // reaction collector to close ticket
                        const closeTicket = supportEmbed.createReactionCollector(closeTicketFilter, { max: 1 });
                        closeTicket.on(`collect`, (reaction, user) => {

                            // stop all collectors
                            msgLoggingCollector.stop();
                            completedTicket.stop();
                            closeTicket.stop();

                            // log user who marked ticket as completed
                            supportCache[message.author.id].closedMod = user;

                            // create transcript embed
                            const transcriptEmbed = new MessageEmbed()
                                .setAuthor(`Wall-E Support`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
                                .setTitle(`Support Ticket Transcript - ${supportCache[message.author.id].user.username}`)
                                .setColor(`FF5733`)
                                .setDescription(supportCache[message.author.id].transcriptLog.join(`\n`))
                                .addFields(
                                    { name: `\u200B`, value: `Ticket completed by: ${supportCache[message.author.id].completedMod}\nTicket closed by: ${supportCache[message.author.id].closedMod}` }
                                )
                                .setTimestamp()
                                .setFooter(`Ticket opened by: ${supportCache[message.author.id].user.username}`, supportCache[message.author.id].user.displayAvatarURL({ format: "png", dynamic: true }))


                            // send a copy of the transcript embed to the user and another to the log-support channel
                            supportCache[message.author.id].user.send(`Here is a transcript of your support ticket:`).then(() => {
                                supportCache[message.author.id].user.send(transcriptEmbed)
                                message.client.channels.cache.get(transcriptLogChannel).send(transcriptEmbed)
                                console.log(supportCache[message.author.id]);
                            });

                            // delete the support channel
                            suppportChan.delete().then(() => {
                                console.log(`Deleted \`${supportCache[message.author.id].user.username}\`'s support ticket channel.`)
                                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${supportCache[message.author.id].user.username}\`'s support ticket channel.`);
                            });
                        });
                    })
                });
            });
        });
    }
}