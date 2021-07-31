const { MessageEmbed } = require('discord.js');
const { prefix, consoleChannel } = require(`../dependencies/resources/config.json`);
const { coloredCircles, checkmark, crossmark } = require(`../dependencies/resources/emojis.json`)

module.exports = {

    name: `help`,
    aliases: [`help`, `commands`, `h`],
    description: `The fucking help command. Use this command to get help with Wall-E commands.`,
    usage: `OR ~help [command name]`,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message, args) {

        // initalize page number & store the selection reactions in an array
        var currpg = 0;

        // get nickname, if user doesn't have a set nickname, return username
        uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Create commands vector & store all live commands in allcmds
        const { commands } = message.client;
        const allcmds = commands.map(command => command.name);
        const totpg = Math.ceil(allcmds.length / coloredCircles.length);

        // if command argument includes a valid command name, push that specific embed, otherwise run the general help command
        if (args[0]) {

            // check if passed agrument exists in commands
            const nameDirect = args[0].toLowerCase();
            const command = commands.get(nameDirect) || commands.find(c => c.aliases && c.aliases.includes(nameDirect));

            // if command doesn't exist, terminate, else run
            if (!command) {
                return message.channel.send(`That's not a valid command, ${message.author}!`);

            } else {

                // send embed for command & react
                message.channel.send({ embeds: [commandEmbed(commands, allcmds, command.name)] }).then(m => {
                    m.react(crossmark.emote)

                    // create reaction filter & reaction collector
                    const deleteFilter = (reaction, user) => { return reaction.emoji.id == crossmark.id && user.id == message.author.id; };
                    const collectorDelete = m.createReactionCollector({ filter: deleteFilter });
                    collectorDelete.on('collect', (reaction, user) => {
                        m.delete()
                            .then(console.log(`Deleted help embed, requested by \`${uName}\``))
                            .then(message.client.channels.cache.get(consoleChannel).send(`Deleted help embed, requested by \`${uName}\``))
                            .catch(console.error);
                    });
                })
            }

        } else {

            // Create intro embed
            const helpMain = new MessageEmbed()
                .setAuthor('Wall-E Bot Help', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
                .setTitle(`Wall-E Help`)
                .setDescription(`Let's get started. Wall-E currently has ${allcmds.length} active commands. If you already know the command you need help for, you can type: 
                    \`\`\`~help [command name]\`\`\`\n\nWall-E's list of current commands include: \`\`\`${commands.map(command => command.name).join(', ')}\`\`\``)
                .setColor(`CC743C`)
                .addFields(
                    { name: `\u200B`, value: `${checkmark.emote} : Start\n${crossmark.emote} : Cancel` }
                )
                .setTimestamp(Date.now())
                .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            // Send intro embed & react
            message.channel.send({ embeds: [helpMain] }).then(helpMessage => {
                helpMessage.react(checkmark.emote)
                helpMessage.react(crossmark.emote)

                // Message Filters
                const yesFilter = (reaction, user) => {
                    return reaction.emoji.id == checkmark.id && user.id == message.author.id;
                };
                const deleteFilter = (reaction, user) => {
                    return reaction.emoji.id == crossmark.id && user.id == message.author.id;
                };
                const backwards = (reaction, user) => {
                    return reaction.emoji.name == '◀️' && user.id == message.author.id;
                };
                const forwards = (reaction, user) => {
                    return reaction.emoji.name == '▶️' && user.id == message.author.id;
                };

                // Create blank arrays for filters & collectors
                var emojiFilters = Array.apply(null, Array(coloredCircles.length)).map(function () { });
                var emojiCollectors = Array.apply(null, Array(coloredCircles.length)).map(function () { });

                // for loop to create reaction filters, ReactionCollectors() and parse variables to commandEmbed()
                for (let i = 0; i <= coloredCircles.length - 1; i++) {

                    // reaction filters & reaction collector initialization
                    emojiFilters[i] = (reaction, user) => { return reaction.emoji.name == coloredCircles[i] && user.id == message.author.id; };
                    emojiCollectors[i] = helpMessage.createReactionCollector({ filter: emojiFilters[i] });

                    // turning on the reaction collectors
                    emojiCollectors[i].on('collect', () => {

                        // edit help embed with command selection
                        helpMessage.edit({ embeds: [commandEmbed(commands, allcmds, helpSelection(currpg, coloredCircles[i], coloredCircles, helpMessage))] }).then(m => {
                            m.react(crossmark.emote)
                        })

                    });

                }

                // reaction collector & filter to start the help command
                const collectoryes = helpMessage.createReactionCollector({ filter: yesFilter });
                collectoryes.on('collect', () => {

                    helpPage(currpg, coloredCircles, allcmds, totpg, helpMessage);

                });

                // reaction collector & filter to go to the previous page & ensure that embed remains within lower bounds of the number of pages
                const clbackwards = helpMessage.createReactionCollector({ filter: backwards });
                clbackwards.on('collect', () => {

                    if (currpg - 1 < 0) {
                        message.channel.send(`That page doesn't exist!`)

                    } else { currpg = currpg - 1 }

                    helpPage(currpg, coloredCircles, allcmds, totpg, helpMessage);

                });

                // reaction collector & filter to go to the next page & ensure that embed remains within upper bounds of the number of pages
                const clforwards = helpMessage.createReactionCollector({ filter: forwards });
                clforwards.on('collect', () => {

                    if (currpg + 2 > totpg) {
                        message.channel.send(`That page doesn't exist!`)

                    } else { currpg = currpg + 1 }

                    helpPage(currpg, coloredCircles, allcmds, totpg, helpMessage);

                });

                // reaction collector to delete the help embed & log event to console
                const collectorDelete = helpMessage.createReactionCollector({ filter: deleteFilter });
                collectorDelete.on('collect', () => {
                    helpMessage.delete()
                        .then(msg => {
                            console.log(`Deleted help embed, requested by \`${uName}\``)
                            message.client.channels.cache.get(consoleChannel).send(`Deleted help embed, requested by \`${uName}\``);
                        })
                        .catch(console.error);
                });

            })

        }

        // function to clear reactions, generate embed based on requested page & react based on reactions on the page
        function helpPage(pageNo, slRxns, cmds, lastpg, mainMsg) {

            // Clear all reactions from main message
            mainMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

            // initialize cmdNo to know how many reactions to iterate through in the embed
            let cmdNo = 0;

            // initialize the first line of helpPage & append all remaining lines
            let helpPage = `${slRxns[0]} : ${cmds[pageNo * slRxns.length]}\n`;
            for (let i = 1; i <= slRxns.length - 1; i++) {
                if (cmds[i + pageNo * slRxns.length]) {
                    helpPage += slRxns[i] + ` : ` + cmds[i + pageNo * slRxns.length] + `\n`;
                    cmdNo++;
                }
            }

            // generate the embed of a given page of commands
            const helpPageEmbed = new MessageEmbed()
                .setAuthor('Wall-E Bot Help', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
                .setTitle(`Command Selector`)
                .setDescription(`Select the emoji that corresponds to the command to select it & get help for that command`)
                .setColor(`#CC743C`)
                .addFields(
                    { name: `\u200B`, value: helpPage },
                    { name: `\u200B`, value: ` Select ◀️ or ▶️ to navigate through pages or select ${crossmark.emote} to cancel` }
                )
                .setTimestamp(Date.now())
                .setFooter(`Requested by: ${uName}\nPage ${pageNo + 1} of ${lastpg}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            // react with the correct emojis based on the current page & always include delete
            if (pageNo == 0) {
                mainMsg.react(`▶️`)
            } else if (lastpg == pageNo + 1) {
                mainMsg.react(`◀️`)
            } else {
                mainMsg.react(`◀️`)
                mainMsg.react(`▶️`)
            }
            mainMsg.react(crossmark.emote)

            // React with selection emojis
            for (let i = 0; i <= cmdNo; i++) {
                mainMsg.react(coloredCircles[i])
            }

            // send the message & exit the function
            return mainMsg.edit({ embeds: [helpPageEmbed] });

        }

        // function to return the selection from the embed reactions
        function helpSelection(currpg, selection, selRxns, mainMsg) {

            // Clear all reactions from main message
            mainMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

            // initialize selection variable
            let selNo = 0;

            // use switch-case to detemine selection. Change to for() loop in future?
            switch (selection) {
                case `🔴`:
                    selNo = (currpg * selRxns.length);
                    break;

                case `🟠`:
                    selNo = (currpg * selRxns.length) + 1;
                    break;

                case `🟡`:
                    selNo = (currpg * selRxns.length) + 2;
                    break;

                case `🟢`:
                    selNo = (currpg * selRxns.length) + 3;
                    break;

                case `🔵`:
                    selNo = (currpg * selRxns.length) + 4;
                    break;

                case `🟣`:
                    selNo = (currpg * selRxns.length) + 5;
                    break;
            }

            return selNo;
        }

        // function to generate embed, given a command selection
        function commandEmbed(commands, allcmds, cmdSelection) {

            // Initialize data variable & get specific command info to store in command
            const commandInfo = [];
            const commandRestrictions = [];

            // check to determine if the command is given the command ID or the command name itself
            if (isNaN(cmdSelection)) {
                var command = commands.get(cmdSelection);
            } else {
                var command = commands.get(allcmds[cmdSelection]);
            }

            // Add information about the command into commandInfo & the format in specificInfo to send, with error checking
            if (command.aliases) commandInfo.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.requiredPermissions) commandInfo.push(`**Required Permissions:** ${command.aliases.join(', ')}`);
            if (command.usage) commandInfo.push(`\n**Usage:** \`\`\`${prefix}${command.name} ${command.usage}\`\`\``);
            if (!command.usage) commandInfo.push(`\n**Usage:** \`\`\`${prefix}${command.name}\`\`\``);

            // Add information about command restrictions into commandRestrictions, using vb formatting to only highlight boolean values
            commandRestrictions.push(`**Command Restrictions**`)
            commandRestrictions.push(`\`\`\`vb\n`);
            commandRestrictions.push(`Needs arguments: ${command.args}\n`);
            commandRestrictions.push(`Needs a tagged user: ${command.needsTaggedUser}\n`);
            commandRestrictions.push(`Server Only: ${command.guildOnly}\n`);
            commandRestrictions.push(`Developer Only: ${command.developerOnly}\n`);
            commandRestrictions.push(`\`\`\``);

            // check to ensure there isn't a blank variable passed to the embed field
            specificInfo = commandInfo, { split: true };
            if (specificInfo == ``) {
                specificInfo = `No additional info yet!`;
            }

            // create embed for the selected command
            const commandEmbed = new MessageEmbed()
                .setAuthor('Wall-E Bot Help', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
                .setTitle(`Wall-E Command: ${command.name}`)
                .setDescription(command.description)
                .setColor(`CC743C`)
                .addFields(
                    { name: `\u200B`, value: `${specificInfo}` },
                    { name: `\u200B`, value: `${commandRestrictions.join(``)}` },
                    { name: `\u200B`, value: `Select ${crossmark.emote} to close this help window` }
                )
                .setTimestamp(Date.now())
                .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            return commandEmbed;

        }
    }
};