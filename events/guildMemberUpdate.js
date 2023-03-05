module.exports = {

	name: `guildMemberUpdate`,
	once: false,

	async execute(client, oldMember, newMember) {
		const studentsRoleID = client.config.ROLES.STUDENTS;

		// if the user has the role already, return
		if (oldMember._roles.includes(studentsRoleID)) return;

		// if the user does not have the students role when adding roles, assign them the role.
		// Role is assigned late due to community verification requirements
		let guildMemberObject = oldMember.guild.members.cache.get(oldMember.id);
		await guildMemberObject.roles.add(studentsRoleID);
	},
};