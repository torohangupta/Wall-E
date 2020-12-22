const { MessageEmbed } = require("discord.js");
const { consoleChannel, userIDs } = require(`../config.json`)

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
            message.channel.send(`I'm sorry, you can't use this command here. This command was custom written for the **Online College** Discord Server & will not work properly here.`);
            return;
        }

        transcriptLogChannel = `789907442582028308`;

        // get author's username/nickname if it exists
        authorName = message.member.nickname;
        if (!authorName) authorName = message.author.username;

        // Delete passed command & log deletion in console
        message.delete()
            .then(msg => {
                console.log(`Deleted '${msg}' from ${authorName}`)
                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${msg}\` from \`${authorName}\``);
            })
            .catch(console.error);

        // check to make sure user doesn't already have a support ticket open
        if (message.guild.channels.cache.find(c => c.name.includes(`support-${message.author.username}`))) {
            message.channel.send(`You already have a support ticket open. Please close that one before opening a new one.`);
            return;
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

            // create message logging
            msgLog = [];
            logIndex = 0;
            const msgLoggingCollector = sc.createMessageCollector(m => m.author.id != userIDs.walle && m.channel.name.includes(`support-${message.author.username}`));
            msgLoggingCollector.on(`collect`, m => {
                if (m.embeds[0]) {
                    msgLog[logIndex] = `**${m.author.username}** - [Message Embed]`;
                } else if (m.attachments.map(a => a)[0]) {
                    msgLog[logIndex] = `**${m.author.username}** - [Message Attachment]`;
                } else {
                    msgLog[logIndex] = `**${m.author.username}** - ${m.content}`;
                }
                logIndex++
            })

            // change support ticket status to being helped
            const helpingCollector = sc.createMessageCollector(m => m.author.id != message.author.id && m.author.id != userIDs.walle && m.channel.name.includes(`support-${message.author.username}`), { max: 1 });
            helpingCollector.on(`end`, c => {
                sc.setName(`🟠-support-${message.author.username}`)
            })

            // create support embed
            const supportEmbed = new MessageEmbed()
                .setTitle(`New support ticket - ${message.author.username}`)
                .setDescription(`User: ${message.author}\n\nPlease list the issue/problem you're having. Please be as detailed as possible.\nA mod will get back to you ASAP.`)
                .setColor(`FF5733`)
                .setTimestamp()

            // send user tag, embed & react to embed
            sc.send(`${message.author},`).then(() => {
                sc.send(supportEmbed).then(supportEmbed => {
                    supportEmbed.react(`❌`)

                    // create filter & collector to mark ticket as completed
                    const helpedCollectorFilter = (reaction, user) => { return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != message.author.id; };
                    const helpedCollector = supportEmbed.createReactionCollector(helpedCollectorFilter, { max: 1 });

                    // set support status ticket to completed & waiting for secondary confirmation
                    helpedCollector.on('collect', (reaction, userMarkedCompleted) => {
                        sc.setName(`🟢-support-${message.author.username}`)

                        // create filter & collector to delete ticket
                        const deleteCollecterFilter = (reaction, user) => {
                            return reaction.emoji.name == `❌` && user.id != userIDs.walle && user.id != message.author.id && userMarkedCompleted.id != user.id;
                        };
                        const deleteCollector = supportEmbed.createReactionCollector(deleteCollecterFilter, { max: 1 });

                        // delete support ticket channel after 2 valid reactions
                        deleteCollector.on('end', () => {

                            // stop all message collectors
                            msgLoggingCollector.stop();
                            helpingCollector.stop();

                            // create transcript embed
                            const transcriptEmbed = new MessageEmbed()
                                .setAuthor(`Wall-E Support`, `https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg`)
                                .setTitle(`Support Ticket Transcript - ${message.author.username}`)
                                .setColor(`FF5733`)
                                .setDescription(msgLog.join(`\n`))
                                .setTimestamp()
                                .setFooter(`Ticket opened by: ${authorName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

                            // send a copy of the transcript embed to the user and another to the log-support channel
                            message.author.send(`Here is a transcript of your support ticket:`)
                            message.author.send(transcriptEmbed)
                            message.client.channels.cache.get(transcriptLogChannel).send(transcriptEmbed)

                            // end the helped collector
                            helpedCollector.stop()

                            sc.delete()
                                .then(() => {
                                    console.log(`Deleted \`${authorName}\`'s support ticket channel.`)
                                    message.client.channels.cache.get(consoleChannel).send(`Deleted \`${authorName}\`'s support ticket channel.`);
                                })
                        });
                    });
                })
            })
        })
    },
}