const roleID = {
    "incoming": "804213020610789376",
    "graduated": "804216647975174144",
    "freshman": "804213426515345428",
    "sophomore": "804213586779045898",
    "junior": "804213800098070528",
    "senior": "804214005102542848",
    "masters": "879043494054866984",
    "gradprogram": "879043497531932672"
};
const yearRoleIDs = Object.keys(roleID).map((key) => roleID[key]);

module.exports = {

    id: `year`,

    async execute(client, interaction) {

        // remove all year roles, then give selected role, then edit the embed to reflect member counts
        await interaction.member.roles.remove(yearRoleIDs);
        let yearSelection = await interaction.values[0];
        await interaction.member.roles.add(yearRoleIDs[parseInt(yearSelection)]);
        await embedEditor(client, interaction.message);

        // defer update since actions are not directly related to the interaction
        interaction.deferUpdate();

        // function to edit the embed to reflect member counts

    }
};

async function embedEditor(client, message) {

    // grab the select menus from the existing embed to reuse
    const msgComponents = message.components;

    // create blank array to add role member counts to & then push them to the array
    var yearRoleMemberCount = [];
    for (let i = 0; i < yearRoleIDs.length; i++) {
        let memCt = await message.guild.roles.cache.get(yearRoleIDs[i]).members.size;
        yearRoleMemberCount.push(memCt.toString().padStart(3, ' ')); // ensure all strings are the same length
    }

    const field1 = [
        `\` ${yearRoleMemberCount[0]} \` 🥚 - Incoming/Prospective`,
        `\` ${yearRoleMemberCount[1]} \` 🎓 - Graduated`
    ];
    const field2 = [
        `__Undergraduate Roles__`,
        `\` ${yearRoleMemberCount[2]} \` 👶 - Freshman`,
        `\` ${yearRoleMemberCount[3]} \` 💪 - Sophomore`,
        `\` ${yearRoleMemberCount[4]} \` 🧠 - Junior`,
        `\` ${yearRoleMemberCount[5]} \` 👑 - Senior/Senior+`
    ];
    const field3 = [
        `__Graduate Program Roles__`,
        `\` ${yearRoleMemberCount[6]} \` 📝 - Masters Program`,
        `\` ${yearRoleMemberCount[7]} \` 🥼 - Graduate Program`
    ];

    // create the embed
    const yearEmbed = client.embedCreate({
        description: `⬇️ Please select your year using the menu below! ⬇️`,
        fields: [
            { name: `\u200B`, value: field1.join(`\n`) },
            { name: `\u200B`, value: field2.join(`\n`) },
            { name: `\u200B`, value: field3.join(`\n`) },
            { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)* ` },
        ],
        color: `F1BE48`,
    });

    // edit the message to reflect the new embed with updated role count values
    return message.edit({ embeds: [yearEmbed], components: msgComponents })
}