module.exports = {

    name: `clean`,

    execute(client, interaction) {

        // del all role
        // const guildRoleCache = interaction.guild.roles.cache;
        // guildRoleCache.forEach(guildRole => {
        //     if (inputScrubber(guildRole.name)) guildRole.delete();
        // });

        // // del all chan
        // const guildChannelCache = interaction.guild.channels.cache;
        // guildChannelCache.forEach(guildChan => {
        //     if (inputScrubber(guildChan.name)) guildChan.delete();
        // });

        interaction.reply({ content: `You can't use that`, allowedMentions: { repliedUser: false } });
    }
};

// function inputScrubber(classInput) {

//     // Attempt to split department and course number & process department input
//     const department = classInput.match(/([A-Za-z\s]+)/)[0];
//     const classNumber = classInput.split(department)[1];
//     const scrubbedDepartment = department.toUpperCase().replaceAll(/[^A-Z]/g, ``);

//     // check to see if the department includes 
//     const { deptCodes } = require(`../../utils/resources/deptCodes.js`);
//     const validatedInput = deptCodes[scrubbedDepartment];

//     // create normalized classcode and test to match expected format
//     const classCode = `${validatedInput} ${classNumber}`;
//     if (!classCode.match(/([^\s:,.\)a-z0-9])([A-Z\s]+)(\s)([0-9]{3}[A-Z]{0,1})(?![a-zA-Z0-9])/g)) return undefined;

//     // if format matches, create & return the classDetails object, else return undefined
//     if (validatedInput) {
//         const searchTerm = classCode.replaceAll(` `, `+`);
//         const channelName = classCode.replaceAll(` `, ``).toLowerCase();
//         const url = `https://catalog.iastate.edu/search/?search=${searchTerm}`;
//         return {
//             classCode: classCode,
//             channelName: channelName,
//             url: url
//         };
//     } else return undefined;
// }