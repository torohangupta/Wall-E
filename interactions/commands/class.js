module.exports = {
    name: `class`,

    async execute(client, interaction) {

        // get & sanatize inputs
        const subCommand = interaction.options._subcommand;
        const userRoleIDs = interaction.member._roles;


        if ([`create`, `delete`].includes(subCommand) && !userRoleIDs.includes(client.config.ROLES.MOD)) return 0;

        let sanatizedArgs = [];
        if ([`join`, `leave`, `create`, `delete`].includes(subCommand)) {
            const passedArgs = interaction.options._hoistedOptions[0].value;
            sanatizedArgs = passedArgs.split(/,+/).map(arg => {
                return inputScrubber(arg);
            });
        }

        /** console.log(sanatizedArgs)
            [
                {
                    classCode: 'AER E 149',
                    department: 'AER E',
                    classNumber: '149',
                    channelName: 'aere149',
                    url: 'https://catalog.iastate.edu/search/?search=AER+E+149'
                },
                {
                    classCode: 'AER E 284',
                    department: 'AER E',
                    classNumber: '284',
                    channelName: 'aere284',
                    url: 'https://catalog.iastate.edu/search/?search=AER+E+284'
                }
            ]
        */
        let message = ``;
        switch (subCommand) {
            case `join`:
                message = classJoin(interaction, sanatizedArgs);
                break;
            case `leave`:
                message = classLeave(interaction, sanatizedArgs);
                break;
            case `leave-all`:
                message = classLeaveAll(interaction);
                break;
            case `create`:
                message = await classCreate(client, interaction, sanatizedArgs[0]);
                if (sanatizedArgs.length > 1) message += `\nThe remaining courses were not created. Please only create a channel & role for one course at a time.`;
                break;
            case `delete`:
                message = classDelete(client, interaction, sanatizedArgs);
                if (sanatizedArgs.length > 1) message += `\nThe remaining courses were not deleted. Please only delete a channel & role for one course at a time.`;
                break;
        }

        interaction.reply({ content: message })
    }
}

/**
 * Attempts to scrub/sanitize user input 
 * @param {String} classInput User Input
 * @returns {Object|undefined}
 */
function inputScrubber(classInput) {

    // Attempt to split department and course number & process department input
    const department = classInput.match(/([A-Za-z\s]+)/)[0];
    const classNumber = classInput.split(department)[1];
    const scrubbedDepartment = department.toUpperCase().replaceAll(/[^A-Z]/g, ``);

    // check to see if the department includes 
    const { deptCodes } = require(`../../utils/resources/deptCodes.js`);
    const validatedInput = deptCodes[scrubbedDepartment];

    // create normalized classcode and test to match expected format
    const classCode = `${validatedInput} ${classNumber}`;
    if (!classCode.match(/([^\s:,.\)a-z0-9])([A-Z\s]+)(\s)([0-9]{3}[A-Z]{0,1})(?![a-zA-Z0-9])/g)) return undefined;

    // if format matches, create & return the classDetails object, else return undefined
    if (validatedInput) {
        const searchTerm = classCode.replaceAll(` `, `+`);
        const channelName = classCode.replaceAll(` `, ``).toLowerCase();
        const url = `https://catalog.iastate.edu/search/?search=${searchTerm}`;
        return {
            classCode: classCode,
            channelName: channelName,
            url: url
        };
    } else return undefined;
}

function classValidator(course) {

}

function classJoin(courses) {

}

function classLeave(course) {

}

/**
 * Function to leave all the user's class roles
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @returns {String} output message
 */
function classLeaveAll(interaction) {
    const userRoleIDs = interaction.member._roles;
    const guildRoleCache = interaction.guild.roles.cache;
    const guildMember = interaction.guild.members.cache.get(interaction.member.id);
    let rolesLeftArray = [];

    // iterate though each role and remove if it's a valid course
    userRoleIDs.forEach(classRoleId => {
        // for each of the userRoleIDs, get it's object from the cache
        const userRole = guildRoleCache.find(r => r.id === classRoleId);

        // determine if the course is a valid course to remove
        const role = inputScrubber(userRole.name);
        if (role) {
            guildMember.roles.remove(userRole);
            rolesLeftArray.push(`\`${userRole.name}\``);
        }
    });

    return rolesLeftArray.length === 0 ?
        `There were no classes for you to leave!` :
        `You left the following \`${rolesLeftArray.length}\` course(s):\n> ${rolesLeftArray.join(`, `)}`;
}

async function classCreate(client, interaction, courseObject) {

    // ##################################################################################################################
    // Ensure that the user is a mod, the arg passed the scrubber & the course channel & role doesn't already exist
    const userRoleIDs = interaction.member._roles;
    if (!userRoleIDs.includes(client.config.ROLES.MOD)) return `I'm sorry, only moderators can use this command!`;

    if (!courseObject) return `That doesn't look like a valid course! Please check your spelling and try again. If this problem presists, please let Rohan know.`;

    const newCourseName = courseObject.channelName;
    const guildChannelCache = interaction.guild.channels.cache;
    if (guildChannelCache.find(role => role.name == newCourseName)) return `The channel for this course exists already!`;
    // ##################################################################################################################

    // create the role
    const newRole = await interaction.guild.roles.create({
        name: newCourseName,
        permissions: [],
        mentionable: true,
    });

    // create the channel & add the proper permissions
    const newChan = await interaction.guild.channels.create(newCourseName, {
        type: `GUILD_TEXT`,
        permissionOverwrites: [
            {
                id: interaction.channel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: client.config.ROLES.MOD, // Supreme Overseers
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: client.config.ROLES.BOT, // Bot Overlords
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: newRole.id, // role that was just created
                allow: [`VIEW_CHANNEL`],
            }
        ],
    });

    // send a message to the newly created channel
    const newChannelEmbed = client.embedCreate({
        description: `Welcome to the ${newChan} channel & thank you for adding the class! If you are seeing this message, that means it is probably a new channel. Don't hesitate to share the server with your classmates to see more of them in the server/channel! Feel free to use this channel for your class & if you need anything, let the mod team know and we'd be happy to help!`,
        conor: `45AD80`,
        timestamp: true,
    });
    await newChan.send({ embeds: [newChannelEmbed] });

    // if the channel & role was created successfully, send a message to the updates channel & return successful message, else return failure message
    if (newRole && newChan) {
        client.channels.cache.get(client.config.CHANNELS.UPDATES).send({ content: `📥  **New channel added!** - \`${newCourseName}\`` });
        return `Created a channel & role for ${newCourseName}`;
    } else return `Failed to create a channel & role for ${newCourseName}`;
}

function classDelete(client, interaction, courseObject) {

}

