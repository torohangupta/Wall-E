const { MessageEmbed } = require(`discord.js`);
const { consoleChannel, updatesChannel } = require(`../../dependencies/resources/config.json`);

module.exports = {

    name: `class`,
    whitelistedChannels: `789256304844603494`,
    blacklistedChannels: ``,

    execute(interaction) {

        const subCommand = interaction.options._subcommand;
        const guildRoleCache = interaction.guild.roles.cache; // cache guild roles
        const guildChannelCache = interaction.guild.channels.cache; // cache guild channels
        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        const userRoleIDs = interaction.member._roles;
        var successRoles = [];
        var failureRoles = [];
        var successMessage = ``;
        var failureMessage = ``;
        var replyMessage = ``;
        var args = [];


        if ([`join`, `leave`, `create`, `delete`].includes(subCommand)) {
            args = interaction.options._hoistedOptions[0].value.split(/,+/).map(arg => {
                return arg.toString().trim().toLowerCase();
            });
        }

        switch (subCommand) {
            case `join`:
                args.forEach(classRoleName => {
                    let classRoleObject = guildRoleCache.find(r => r.name === classRoleName);

                    if (classRoleObject && /([a-z]{2,4}\d{3})/g.test(classRoleName) && !userRoleIDs.includes(classRoleObject.id)) {
                        guildMemberObject.roles.add(classRoleObject);
                        successRoles.push(`\`${classRoleName}\``);
                    } else {
                        failureRoles.push(`\`${classRoleName}\``);
                    }
                });

                successRoles != 0 ? successMessage = `You joined the following course(s):\n> ${successRoles.join(`, `)}` : successMessage = ``;
                failureRoles != 0 ? (failureMessage = `There was an error joining the following course(s):\n> ${failureRoles.join(`, `)}`,  replyMessage = `Those course(s) might not exist yet, you also could have a space in between the classcode or you already have those course(s) added. If you think this is a mistake, please reach out to the mods using <#866434475495129118> and we can create the class for you!`) : failureMessage = ``;

                break;

            case `leave`:
                args.forEach(classRoleName => {
                    let classRoleObject = guildRoleCache.find(r => r.name === classRoleName);

                    if (classRoleObject && /([a-z]{2,4}\d{3})/g.test(classRoleName) && userRoleIDs.includes(classRoleObject.id)) {
                        guildMemberObject.roles.remove(classRoleObject);
                        successRoles.push(`\`${classRoleName}\``);
                    } else {
                        failureRoles.push(`\`${classRoleName}\``);
                    }
                });

                successRoles != 0 ? successMessage = `You left the following course(s):\n> ${successRoles.join(`, `)}` : successMessage = ``;
                failureRoles != 0 ? (failureMessage = `There was an error leaving the following course(s):\n> ${failureRoles.join(`, `)}`,  replyMessage = `You can't leave course(s) that you're not in or that do not exist on the server! If you think this is a mistake, please reach out to the mods using <#866434475495129118> and we'll be able to help!`) : failureMessage = ``;

                break;

            case `leave-all`:
                var numClassesLeft = 0;
                userRoleIDs.forEach(classRoleId => {
                    let userRole = guildRoleCache.find(r => r.id === classRoleId);

                    if (/([a-z]{2,4}\d{3})/g.test(userRole.name)) {
                        guildMemberObject.roles.remove(userRole);
                        successRoles.push(`\`${userRole.name}\``);
                        numClassesLeft++;
                    }
                });
                numClassesLeft == 0 ? successMessage =`There were no course(s) for you to leave!` : successMessage = `You left the following \`${numClassesLeft}\` course(s):\n> ${successRoles.join(`, `)}`;
                break;

            case `create`:
                // restrict to moderators
                if (!userRoleIDs.includes(`692097359005351947`)) {
                    return interaction.reply({ content: `I'm sorry, only moderator can use this command!`, ephemeral: true });
                }

                const newRoleName = args[0].toLowerCase();

                // check to make sure the role doesn't exist already
                if (guildRoleCache.find(role => role.name == newRoleName)) {
                    return replyMessage = `Error: This course exists already!`;
                }

                // try to create the role
                try {
                    // Create a new role with the name mentioned, then a channel restricted to that role
                    interaction.guild.roles.create({
                        name: newRoleName,
                        permissions: [],
                        mentionable: true,
                    }).then(r => {
                        interaction.guild.channels.create(newRoleName, {
                            type: `text`,
                            parent: guildChannelCache.find(c => c.name.toLowerCase().includes(`unsorted courses`) && c.type == 'category'),
                            permissionOverwrites: [
                                {
                                    id: interaction.channel.guild.roles.everyone,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: `692097359005351947`, // Supreme Overseers
                                    allow: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: `692100602297188382`, // Bot Overlords
                                    allow: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: r.id, // role that was just created
                                    allow: [`VIEW_CHANNEL`],
                                }
                            ],
                        }).then(chan => {
                            chan.send(`Welcome to the ${chan} channel & thank you for adding the class! If you are seeing this message, that means it is probably a new channel. Don't hesitate to share the server with your classmates to see more of them in the server/channel! Feel free to use this channel for your class & if you need anything, let the mod team know and we'd be happy to help!`);
                        })
                    })
                    replyMessage = `The role \`${newRoleName}\` has been created.`;
                    interaction.client.channels.cache.get(updatesChannel).send(`📥  **New channel added!** - \`${newRoleName}\``);

                } catch (error) {
                    replyMessage = `There was an error.`;
                    interaction.client.channels.cache.get(consoleChannel).send(`\`\`\`${error}\`\`\``);
                    console.log(error);
                }
                break;

            case `delete`:
                // restrict to moderators
                if (!userRoleIDs.includes(`692097359005351947`)) {
                    return interaction.reply({ content: `I'm sorry, only moderators can use this command!`, ephemeral: true });
                }

                replyMessage = `Sorry, this doesn't work yet!`;
                break;
        }

        // create reply embed
        const replyEmbed = new MessageEmbed()
            .setDescription(`**Online College Class Manager**`)
            .setColor(`45ad80`)

        // dynamically add embed elements
        successMessage ? replyEmbed.addFields({ name: `\u200B`, value: successMessage }) : ``;
        failureMessage ? replyEmbed.addFields({ name: `\u200B`, value: failureMessage }) : ``;
        replyMessage ? replyEmbed.addFields({ name: `\u200B`, value: replyMessage }) : ``;

        // reply to the interaction
        interaction.reply({ embeds: [replyEmbed] });
    }
};