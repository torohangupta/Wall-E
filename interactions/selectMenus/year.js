const { MessageEmbed } = require("discord.js");
const { roleID } = require(`../../dependencies/resources/config.json`)

module.exports = {

    id: `year`,

    async execute(interaction) {

        // get array of roleIDs from roleID object in config.json
        var yearRoleIDs = Object.keys(roleID.year).map((key) => roleID.year[key]);

        // remove all year roles, then give requested role, then edit the embed to reflect member counts
        interaction.member.roles.remove(yearRoleIDs)
            .then(() => {
                let yearSelection = interaction.values[0]
                interaction.member.roles.add(yearRoleIDs[parseInt(yearSelection)])
            })
            .then(embedEditor(interaction.message))
            .catch(console.error);


        interaction.deferUpdate();

        function embedEditor(message) {
            // grab the select menus from the existing embed to reuse
            const msgComponents = message.components;

            // create blank array to add role member counts to & then push them to the array
            var yearRoleMemberCount = [];
            for (let i = 0; i < yearRoleIDs.length; i++) {
                let memCt = message.guild.roles.cache.get(yearRoleIDs[i]).members.size;
                yearRoleMemberCount.push(memCt.toString().padStart(3, ' ')); // ensure all strings are the same length
            }

            // create the embed
            const yearEmbed = new MessageEmbed()
                .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
                .setColor(`F1BE48`)
                .setFields(
                    { name: `\u200B`, value: `\` ${yearRoleMemberCount[0]} \` 🥚 - Incoming/Prospective\n\` ${yearRoleMemberCount[1]} \` 🎓 - Graduated` },
                    { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${yearRoleMemberCount[2]} \` 👶 - Freshman\n\` ${yearRoleMemberCount[3]} \` 💪 - Sophomore\n\` ${yearRoleMemberCount[4]} \` 🧠 - Junior\n\` ${yearRoleMemberCount[5]} \` 👑 - Senior/Senior+` },
                    { name: `\u200B`, value: `__Graduate Program Roles__\n\` ${yearRoleMemberCount[6]} \` 📝 - Masters Program\n\` ${yearRoleMemberCount[7]} \` 🥼 - Graduate Program` },
                    { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)* ` },
                )

            // edit the message to reflect the new embed with updated role count values
            message.edit({ embeds: [yearEmbed], components: msgComponents })
        }
    }
};