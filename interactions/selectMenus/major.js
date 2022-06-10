const { MessageEmbed } = require("discord.js");
const { roleID } = require(`../../dependencies/resources/config.json`)

module.exports = {

    id: `major`,

    async execute(interaction) {

        // get array of roleIDs from roleID object in config.json
        var majorRoleIDs = Object.keys(roleID.major).map((key) => roleID.major[key]);

        // remove all major roles, then give selected role(s), then edit the embed to reflect member counts
        await interaction.member.roles.remove(majorRoleIDs)
        let majorSelection = interaction.values;
        majorSelection.forEach(selection => {
            interaction.member.roles.add(majorRoleIDs[parseInt(selection)])
        });
        embedEditor(interaction.message)

        // defer update since actions are not directly related to the interaction
        interaction.deferUpdate();

        // function to edit the embed to reflect member counts
        function embedEditor(message) {
            
            // grab the select menus from the existing embed to reuse
            const msgComponents = message.components;

            // create blank array to add role member counts to & then push them to the array
            var majorRoleMemberCount = [];
            for (let i = 0; i < majorRoleIDs.length; i++) {
                let memCt = message.guild.roles.cache.get(majorRoleIDs[i]).members.size;
                majorRoleMemberCount.push(memCt.toString().padStart(3, ' ')); // ensure all strings are the same length
            }

            // create the embed
            const majorEmbed = new MessageEmbed()
                .setDescription(`⬇️ Please select your major using the menu below! ⬇️`)
                .setColor(`E92929`)
                .setFields(
                    { name: `\u200B`, value: `\` ${majorRoleMemberCount[0]} \` | \` AER E \` - ✈️ Aerospace Engineering\n\` ${majorRoleMemberCount[1]} \` | \` A B E \` - 🚜 Agricultural & Bio-Systems Engineering\n\` ${majorRoleMemberCount[2]} \` | \`  CH E \` - 🔬 Chemical Engineering\n\` ${majorRoleMemberCount[3]} \` | \`   C E \` - 🌉 Civil Engineering\n\n\` ${majorRoleMemberCount[4]} \` | \` CPR E \` - 💾 Computer Engineering\n\` ${majorRoleMemberCount[5]} \` | \` COM S \` - ⌨️ Computer Science\n\` ${majorRoleMemberCount[6]} \` | \` CON E \` - 🏗️ Construction Engineering\n\` ${majorRoleMemberCount[7]} \` | \` CYS E \` - 📡 Cybersecurity Engineering\n\n\` ${majorRoleMemberCount[8]} \` | \`    DS \` - 🖨️ Data Science\n\` ${majorRoleMemberCount[9]} \` | \`   E E \` - 💡 Electrical Engineering\n\` ${majorRoleMemberCount[10]} \` | \`   E M \` - 🛠️ Engineering Mechanics\n\` ${majorRoleMemberCount[11]} \` | \` ENV E \` - 🌿 Environmental Engineering\n\n\` ${majorRoleMemberCount[12]} \` | \`   I E \` - 🏭 Industrial Engineering\n\` ${majorRoleMemberCount[13]} \` | \` MAT E \` - 🧱 Materials Science & Engineering\n\` ${majorRoleMemberCount[14]} \` | \`   M E \` - ⚙️ Mechanical Engineering\n\` ${majorRoleMemberCount[15]} \` | \`   S E \` - 💻 Software Engineering` },
                    { name: `\u200B`, value: `*Select your major(s) to gain access to the major-specific channels\nfor your program!*` }
                )

            // edit the message to reflect the new embed with updated role count values
            return message.edit({ embeds: [majorEmbed], components: msgComponents })
        }
    }
};