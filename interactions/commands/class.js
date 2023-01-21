module.exports = {
    name: `class`,

    async execute(client, interaction) {

        // get & sanatize inputs
        const subCommand = interaction.options._subcommand;
        const userRoleIDs = interaction.member._roles;


        if ([`create`, `delete`].includes(subCommand) && !userRoleIDs.includes(client.config.ROLES.MOD)) return err(client, interaction, `NOT_MOD`);

        let sanatizedArgs = [];
        if ([`join`, `leave`, `create`, `delete`].includes(subCommand)) {
            const passedArgs = interaction.options._hoistedOptions[0].value;
            sanatizedArgs = passedArgs.split(/,+/).map(arg => {
                return inputScrubber(arg);
            }).filter(input => input !== undefined);
        }
        if (sanatizedArgs.length === 0 && subCommand !== `leave-all`) return err(client, interaction, `NO_ARGS`);

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
                message = await classDelete(client, interaction, sanatizedArgs[0]);
                if (sanatizedArgs.length > 1) message += `\nThe remaining courses were not deleted. Please only delete a channel & role for one course at a time.`;
                break;
        }

        const embed = client.embedCreate({
            description: `**Online College Class Manager**`,
            fields: [
                { name: `\u200B`, value: message },
            ],
            color: `45AD80`,
        })
        interaction.reply({ embeds: [embed] })
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

/**
 * Function to send an ephemeral message to the user when an error occurs
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @param {`NOT_MOD`|`NO_ARGS`} code The "error" code that is created.
 */
function err(client, interaction, code) {
    switch (code) {
        case `NOT_MOD`:
            interaction.reply({ content: `I'm sorry, only moderators can use this command!`, ephemeral: true });
            break;
        case `NO_ARGS`:
            interaction.reply({ content: `I'm sorry, it looks like you didn't have any valid arguments. Please reach out to the mods using the <#${client.config.CHANNELS.CONTACT_MODS}> channel if you believe this to be an error.`, ephemeral: true });
            break;
    }
}

/**
 * Function to join a specific class or classes
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @param {Array[Object]} courseObjectArray Object array of valid, sanatized courses passed through the function
 * @returns {String} output message
 */
function classJoin(client, interaction, courseObjectArray) {

    const { member, guild } = interaction;

    const userRoleIDs = member._roles;
    const guildMemberObject = guild.members.cache.get(member.id);
    const guildRoleCache = guild.roles.cache;

    let successMessage = ``, failureMessage = ``;
    let successRoles = [], failureRoles = [];
    courseObjectArray.forEach(courseObject => {
        const courseName = courseObject.channelName;
        const courseRole = guildRoleCache.find(role => role.name === courseName);

        if (!courseRole) return failureRoles.push(`\`${courseName}\``);
        if (userRoleIDs.includes(courseRole.id)) return failureRoles.push(`\`${courseRole.name}\``);

        guildMemberObject.roles.add(courseRole);
        return successRoles.push(`\`${courseRole.name}\``);
    });

    if (successRoles.length !== 0) successMessage = `You joined the following course(s):\n> ${successRoles.join(`, `)}`;
    if (failureRoles.length !== 0) failureMessage = `\nThere was an error joining the following course(s):\n> ${failureRoles.join(`, `)}`;
    
    return [successMessage, failureMessage].join(`\n`)
}

/**
 * Function to leave a specific class or classes
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @param {Array[Object]} courseObjectArray Object array of valid, sanatized courses passed through the function
 * @returns {String} output message
 */
function classLeave(client, interaction, courseObjectArray) {

    // destructure interaction object
    const { member, guild } = interaction;

    // set vars
    const userRoleIDs = member._roles;
    const guildMemberObject = guild.members.cache.get(member.id);
    const guildRoleCache = guild.roles.cache;

    let successMessage = ``, failureMessage = ``;
    let successRoles = [], failureRoles = [];

    // for each course, remove the course role from the user if possible, otherwise, push an error
    courseObjectArray.forEach(courseObject => {
        const courseName = courseObject.channelName;
        const courseRole = guildRoleCache.find(role => role.name === courseName);

        if (!courseRole) return failureRoles.push(`\`${courseName}\``);
        if (!userRoleIDs.includes(courseRole.id)) return failureRoles.push(`\`${courseRole.name}\``);

        guildMemberObject.roles.remove(courseRole);
        return successRoles.push(`\`${courseRole.name}\``);
    });

    // create the messages and then return them from the function
    if (successRoles.length !== 0) successMessage = `You left the following course(s):\n> ${successRoles.join(`, `)}`;
    if (failureRoles.length !== 0) failureMessage = `\nThere was an error leaving the following course(s):\n> ${failureRoles.join(`, `)}`;
    
    return [successMessage, failureMessage].join(`\n`)
}

/**
 * Function to leave all the user's class roles
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @returns {String} output message
 */
function classLeaveAll(interaction) {

    // set vars
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

/**
 * Function to create a class channel & it's associated role
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @param {Array[Object]} courseObjectArray Object array of valid, sanatized courses passed through the function
 * @returns {String} output message
 */
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
            // {
            //     id: client.config.ROLES.MOD, // Supreme Overseers
            //     allow: ['VIEW_CHANNEL'],
            // },
            // {
            //     id: client.config.ROLES.BOT, // Bot Overlords
            //     allow: ['VIEW_CHANNEL'],
            // },
            {
                id: newRole.id, // role that was just created
                allow: [`VIEW_CHANNEL`],
            }
        ],
    });

    // send a message to the newly created channel
    const newChannelEmbed = client.embedCreate({
        description: `Welcome to the ${newChan} channel & thank you for adding the class! If you are seeing this message, that means it is probably a new channel. Don't hesitate to share the server with your classmates to see more of them in the server/channel! Feel free to use this channel for your class & if you need anything, let the mod team know and we'd be happy to help!`,
        color: `45AD80`,
        timestamp: true,
    });
    await newChan.send({ embeds: [newChannelEmbed] });

    // if the channel & role was created successfully, send a message to the updates channel & return successful message, else return failure message
    if (newRole && newChan) {
        // client.channels.cache.get(client.config.CHANNELS.UPDATES).send({ content: `📥  **New channel added!** - \`${courseName}\`` });
        return `Created a channel & role for ${courseName}`;
    } else return `Failed to create a channel & role for ${courseName}`;
}

/**
 * Function to delete a class channel & it's associated role
 * @param {Client} client The active BotClient instance
 * @param {Object} interaction The interaction object passed to the interactionCreate event
 * @param {Array[Object]} courseObjectArray Object array of valid, sanatized courses passed through the function
 * @returns {String} output message
 */
async function classDelete(client, interaction, courseObject) {

    // ##################################################################################################################
    // Ensure that the user is a mod, the arg passed the scrubber & the course channel & role exists
    const userRoleIDs = interaction.member._roles;
    // if (!userRoleIDs.includes(client.config.ROLES.MOD)) return `I'm sorry, only moderators can use this command!`;

    if (!courseObject) return `That doesn't look like a valid course! Please check your spelling and try again. If this problem presists, please let Rohan know.`;

    // get the channel & roles
    const courseName = courseObject.channelName;
    const guildChan = interaction.guild.channels.cache.find(channel => channel.name === courseName);
    const guildRole = interaction.guild.roles.cache.find(role => role.name === courseName);
    if (!guildChan && !guildRole) return `The channel & role for this course doesn't exist!`;
    // ##################################################################################################################

    if (guildChan) await guildChan.delete();
    if (guildRole) await guildRole.delete();
    return `deleted${courseName}`;
}
