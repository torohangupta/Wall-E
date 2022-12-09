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
                const scrubbedInput = inputScrubber(arg);
                if (scrubbedInput) return scrubbedInput;
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
                message = classJoin(client, interaction, sanatizedArgs);
                break;
            case `leave`:
                message = classLeave(client, interaction, sanatizedArgs);
                break;
            case `leave-all`:
                message = classLeaveAll(interaction);
                break;
            case `create`:
                message = await classCreate(client, interaction, sanatizedArgs[0]);
                if (sanatizedArgs.length > 1) message += `\nThe remaining courses were not created. Please only create a channel & role for one course at a time.`;
                break;
            case `delete`:
                message = classDelete(client, interaction, sanatizedArgs[0]);
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

function classJoin(client, interaction, courseObjectArray) {

    const { guild, member } = interaction;

    const userRoleIDs = member._roles;
    const guildMemberObject = guild.members.cache.get(member.id);
    const guildRoleCache = guild.roles.cache;

    let successRoles = [];
    let failureRoles = [];
    courseObjectArray.forEach(courseObject => {
        const courseName = courseObject.channelName;
        const courseRole = guildRoleCache.find(role => role.name === courseName);

        if (userRoleIDs.includes(classRoleObject.id)) return failureRoles.push(`\`${classRoleName}\``);

        guildMemberObject.roles.add(classRoleObject);
        return addedRoles.push(`\`${classRoleObject.name}\``);
    });

    successMessage = (successRoles !== 0 ? `You joined the following course(s):\n> ${successRoles.join(`, `)}` : ``);
    failureMessage = (failureRoles !== 0 ? `There was an error joining the following course(s):\n> ${failureRoles.join(`, `)}` : ``);

}

function classLeave(client, interaction, courseObjectArray) {

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

    const courseName = courseObject.channelName;
    const guildChan = interaction.guild.channels.cache.find(channel => channel.name === courseName);
    const guildRole = interaction.guild.roles.cache.find(role => role.name === courseName);
    if (guildChan) return `The channel for this course exists already!`;
    if (guildRole) return `The role for this course exists already!`;
    // ##################################################################################################################

    // create the role
    const newRole = await interaction.guild.roles.create({
        name: courseName,
        permissions: [],
        mentionable: true,
    });

    // create the channel & add the proper permissions
    const newChan = await interaction.guild.channels.create(courseName, {
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
        client.channels.cache.get(client.config.CHANNELS.UPDATES).send({ content: `📥  **New channel added!** - \`${courseName}\`` });
        return `Created a channel & role for ${courseName}`;
    } else return `Failed to create a channel & role for ${courseName}`;
}

async function classDelete(client, interaction, courseObject) {

    // ##################################################################################################################
    // Ensure that the user is a mod, the arg passed the scrubber & the course channel & role exists
    const userRoleIDs = interaction.member._roles;
    if (!userRoleIDs.includes(client.config.ROLES.MOD)) return `I'm sorry, only moderators can use this command!`;

    if (!courseObject) return `That doesn't look like a valid course! Please check your spelling and try again. If this problem presists, please let Rohan know.`;

    // get the channel & roles
    const courseName = courseObject.channelName;
    const guildChan = interaction.guild.channels.cache.find(channel => channel.name !== courseName);
    const guildRole = interaction.guild.roles.cache.find(role => role.name !== courseName);
    if (!guildChan) return `The channel for this course doesn't exist!`;
    if (!guildRole) return `The role for this course doesn't exist!`;
    // ##################################################################################################################

    guildChan.delete();
    guildRole.delete();
}

