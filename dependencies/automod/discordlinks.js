module.exports = {
	name: 'discordLinks',
	execute(message) {

		// "Students" role
		const studentsRoleId = `692097738283810896`;

		// if the user does not have the students role when adding roles, assign them the role. Role is assigned late due to verification requirements
		if (!oldMember._roles.includes(studentsRoleId)) {
			let guildMemberObject = oldMember.guild.members.cache.get(oldMember.id);
			guildMemberObject.roles.add(studentsRoleId)
		}
	},
};