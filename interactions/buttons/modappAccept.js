const { roleID } = require(`../../dependencies/resources/config.json`);

module.exports = {
    
    id: `modappAccept`,

    execute(interaction) {

        // reply to the interaction
        interaction.deferUpdate();

        const guildRoleCache = interaction.guild.roles.cache; // cache guild roles
        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id)
        // Add the Mod & Mod in Training roles
        let modRole = guildRoleCache.find(r => r.id.includes(roleID.mod));
        let modTrainingRole = guildRoleCache.find(r => r.id.includes(roleID.modTraining));

        // add the roles to the guildmember
        guildMemberObject.roles.add([modRole, modTrainingRole]);
    },
};