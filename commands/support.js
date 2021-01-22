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

        transcriptLogChannel = `789907442582028308`;

        // try to access user caches, if they don't exist, create them
        // initialize/access user cache
        try {
            userCache[message.author.id] = [];
        } catch {
            console.log(`Initializing user cache`)
            userCache = {};
            userCache[message.author.id] = [];
        }

        // initialize/access transcript indexing cache
        try {
            logIndexCache[message.author.id] = 0;
        } catch {
            console.log(`Initializing message logging index`)
            logIndexCache = {};            
            logIndexCache[message.author.id] = 0;
        }

        // initialize/access transcript cache
        try {
            msgLogCache[message.author.id] = [];
        } catch {
            console.log(`Initializing message logging cache`)
            msgLogCache = {};
            msgLogCache[message.author.id] = [];
        }

        // initialize/access moderator interaction cache
        try {
            ticketDoneModsCache[message.author.id] = [];
        } catch {
            console.log(`Initializing cache for mods who marked as complete and closed the ticket`)
            ticketDoneModsCache = {};
            ticketDoneModsCache[message.author.id] = [];
        }


        // store nickname in user cache index 0
        userCache[message.author.id][0] = message.member.nickname;
        if (!userCache[message.author.id][0]) userCache[message.author.id][0] = message.author.username;

        // store user in user cache index 1
        userCache[message.author.id][1] = message.author;

        // Delete passed command & log deletion in console
        message.delete()
            .then(msg => {
                console.log(`Deleted '${msg}' from ${userCache[message.author.id][0]}`)
                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${msg}\` from \`${userCache[message.author.id][0]}\``);
            })
            .catch(console.error);

        // check to make sure user doesn't already have a support ticket open
        if (message.guild.channels.cache.find(c => c.name.includes(`support-${message.author.username}`))) {
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
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        }).then(sc => {

            const msgLoggingCollector = sc.createMessageCollector(m => m.author.id != userIDs.walle && m.channel.name.includes(message.author.username));
            msgLoggingCollector.on(`collect`, m => {

                // log the messages sent in the channel
                if (m.embeds[0]) {
                    msgLogCache[message.author.id][logIndexCache[message.author.id]] = `**${m.author.username}** - [Message Embed]`;
                } else if (m.attachments.map(a => a)[0]) {
                    msgLogCache[message.author.id][logIndexCache[message.author.id]] = `**${m.author.username}** - [Message Attachment]`;
                } else {
                    msgLogCache[message.author.id][logIndexCache[message.author.id]] = `**${m.author.username}** - ${m.content}`;
                }

                // iterate the transcript logging counter
                logIndexCache[message.author.id]++
            })

            // change support ticket status to being helped
            const helpingCollector = sc.createMessageCollector(m => m.author.id != message.author.id && m.author.id != userIDs.walle, { max: 1 });
            helpingCollector.on(`end`, c => {
                sc.setName(`🟠-support-${message.author.username}`)
            })

            // create support embed
            const supportEmbed = new MessageEmbed()
                .setTitle(`New support ticket - ${userCache[message.author.id][1].username}`)
                .setDescription(`User: ${message.author}\n\nPlease list the issue/problem you're having. Please be as detailed as possible.\nA mod will get back to you ASAP.`)
                .setColor(`FF5733`)
                .setTimestamp()

            // send user tag, embed & react to embed
            sc.send(`@here, ${message.author} has a support ticket!`).then(() => {
                sc.send(supportEmbed).then(supportEmbed => {
                    supportEmbed.react(`❌`)

                    // create filter & collector to mark ticket as completed
                    const helpedCollectorFilter = (reaction, user) => { return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != message.author.id; };
                    const helpedCollector = supportEmbed.createReactionCollector(helpedCollectorFilter, { max: 1 });

                    // set support status ticket to completed & waiting for secondary confirmation
                    helpedCollector.on('collect', (reaction, userMarkedCompleted) => {

                        // change ticket indicator to completed
                        sc.setName(`🟢-support-${message.author.username}`)

                        // log user who marked ticket as completed
                        ticketDoneModsCache[message.author.id][0] = userMarkedCompleted;

                        // create filter & collector to delete ticket
                        const deleteCollecterFilter = (reaction, user) => {
                            return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != message.author.id && userMarkedCompleted.id != user.id;
                        };
                        const deleteCollector = supportEmbed.createReactionCollector(deleteCollecterFilter, { max: 1 });

                        // delete support ticket channel after 2 valid reactions
                        deleteCollector.on('collect', (reacton, userClosedTicket) => {

                            // log user who closed ticket
                            ticketDoneModsCache[message.author.id][1] = userClosedTicket;

                            // stop all message collectors
                            msgLoggingCollector.stop();
                            helpingCollector.stop();

                            // create transcript embed
                            const transcriptEmbed = new MessageEmbed()
                                .setAuthor(`Wall-E Support`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
                                .setTitle(`Support Ticket Transcript - ${userCache[message.author.id][1].username}`)
                                .setColor(`FF5733`)
                                .setDescription(msgLogCache[message.author.id].join(`\n`))
                                .addFields(
                                    { name: `\u200B`, value: `Ticket completed by: ${ticketDoneModsCache[message.author.id][0]}\nTicket closed by: ${ticketDoneModsCache[message.author.id][1]}` }
                                )
                                .setTimestamp()
                                .setFooter(`Ticket opened by: ${userCache[message.author.id][0]}`, userCache[message.author.id][1].displayAvatarURL({ format: "png", dynamic: true }))

                            // send a copy of the transcript embed to the user and another to the log-support channel
                            userCache[message.author.id][1].send(`Here is a transcript of your support ticket:`)
                            userCache[message.author.id][1].send(transcriptEmbed)
                            message.client.channels.cache.get(transcriptLogChannel).send(transcriptEmbed)

                            // end the helped collector
                            helpedCollector.stop()

                            // delete the support channel
                            sc.delete()
                                .then(() => {
                                    console.log(`Deleted \`${userCache[message.author.id][0]}\`'s support ticket channel.`)
                                    message.client.channels.cache.get(consoleChannel).send(`Deleted \`${userCache[message.author.id][0]}\`'s support ticket channel.`);
                                })
                        });
                    });
                })
            })
        })
    },
}