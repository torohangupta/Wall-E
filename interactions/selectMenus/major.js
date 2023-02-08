// get array of major roleIDs from roleID object
const roleID = {
    "aere": "789736589470990367",
    "abe": "789737168062251029",
    "che": "791025436603318302",
    "ce": "789738504393195541",
    "cpre": "791045815304323124",
    "coms": "791045991397851136",
    "cone": "789738250335289374",
    "cyse": "791014295634837564",
    "ds": "832021187059908649",
    "ee": "789738716913467393",
    "em": "789738852315168799",
    "enve": "984516070612283429",
    "ie": "789739007239520266",
    "mate": "789739213276971028",
    "me": "789739407744827463",
    "se": "791045679023390720"
};
const majorRoleIDs = Object.keys(roleID).map((key) => roleID[key]);

module.exports = {

    id: `major`,

    async execute(client, interaction) {

        // remove all major roles, then give selected role(s), then edit the embed to reflect member counts
        await interaction.member.roles.remove(majorRoleIDs)
        let majorSelection = interaction.values;

        majorSelection.forEach(selection => {
            interaction.member.roles.add(majorRoleIDs[parseInt(selection)])
        });
        await embedEditor(client, interaction.message);

        // defer update since actions are not directly related to the interaction
        interaction.deferUpdate();


    }
};

// function to edit the embed to reflect member counts
async function embedEditor(client, message) {

    // grab the select menus from the existing embed to reuse
    const msgComponents = message.components;

    // create blank array to add role member counts to & then push them to the array
    var majorRoleMemberCount = [];
    for (let i = 0; i < majorRoleIDs.length; i++) {
        let memCt = await message.guild.roles.cache.get(majorRoleIDs[i]).members.size;
        majorRoleMemberCount.push(memCt.toString().padStart(3, ' ')); // ensure all strings are the same length
    }

    // create output in array for easier readibility. \n seperates the groups of 4 options
    const messageArr = [
        `\` ${majorRoleMemberCount[0]} \` | \` AER E \` - ✈️ Aerospace Engineering`,
        `\` ${majorRoleMemberCount[1]} \` | \` A B E \` - 🚜 Agricultural & Bio-Systems Engineering`,
        `\` ${majorRoleMemberCount[2]} \` | \`  CH E \` - 🔬 Chemical Engineering`,
        `\` ${majorRoleMemberCount[3]} \` | \`   C E \` - 🌉 Civil Engineering`,
        `\n`,
        `\` ${majorRoleMemberCount[4]} \` | \` CPR E \` - 💾 Computer Engineering`,
        `\` ${majorRoleMemberCount[5]} \` | \` COM S \` - ⌨️ Computer Science`,
        `\` ${majorRoleMemberCount[6]} \` | \` CON E \` - 🏗️ Construction Engineering`,
        `\` ${majorRoleMemberCount[7]} \` | \` CYS E \` - 📡 Cybersecurity Engineering`,
        `\n`,
        `\` ${majorRoleMemberCount[8]} \` | \`    DS \` - 🖨️ Data Science`,
        `\` ${majorRoleMemberCount[9]} \` | \`   E E \` - 💡 Electrical Engineering`,
        `\` ${majorRoleMemberCount[10]} \` | \`   E M \` - 🛠️ Engineering Mechanics`,
        `\` ${majorRoleMemberCount[11]} \` | \` ENV E \` - 🌿 Environmental Engineering`,
        `\n`,
        `\` ${majorRoleMemberCount[12]} \` | \`   I E \` - 🏭 Industrial Engineering`,
        `\` ${majorRoleMemberCount[13]} \` | \` MAT E \` - 🧱 Materials Science & Engineering`,
        `\` ${majorRoleMemberCount[14]} \` | \`   M E \` - ⚙️ Mechanical Engineering`,
        `\` ${majorRoleMemberCount[15]} \` | \`   S E \` - 💻 Software Engineering`,
    ]

    // create the embed
    const majorEmbed = client.embedCreate({
        description: `⬇️ Please select your major using the menu below! ⬇️`,
        fields: [
            { name: `\u200B`, value: messageArr.join(`\n`) },
            { name: `\u200B`, value: `*Select your major(s) to gain access to the major-specific channels\nfor your program!*` },
        ],
        color: `E92929`,
    });

    console.log(majorRoleMemberCount)

    // edit the message to reflect the new embed with updated role count values
    return message.edit({ embeds: [majorEmbed], components: msgComponents });
};
