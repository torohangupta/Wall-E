const { MessageEmbed } = require("discord.js");
const yearRoleIDs = [`804213020610789376`, `804213426515345428`, `804213586779045898`, `804213800098070528`, `804214005102542848`, `804216647975174144`, `879043494054866984`, `879043497531932672`];

module.exports = {

    id: `undergrad`,

    async execute(interaction) {

        // remove all year roles & then give requested role
        interaction.member.roles.remove(yearRoleIDs)
            .then(() => {
                let yearSelection = interaction.values[0]
                interaction.member.roles.add(yearRoleIDs[parseInt(yearSelection)])
            })
            .then(embedEditor(interaction.message))
            .catch(console.error);


        interaction.deferUpdate();

        // edit the embed to reflect changes
        // embedEditor(interaction.message);

        function embedEditor(message) {
            // grab the select menus from the existing embed to reuse
            const msgComponents = message.components;

            // create blank array to add role member counts to & then push them to the array
            var yearRoleMemberCount = [];
            for (let i = 0; i < yearRoleIDs.length; i++) {
                let memCt = message.guild.roles.cache.get(yearRoleIDs[i]).members.size;
                yearRoleMemberCount.push(memCt.toString().padStart(3, '0'));
            }

            // create the embed
            const yearEmbed = new MessageEmbed()
                .setTitle(`🎓  |  Year Selection`)
                .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
                .setFields(
                    { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${yearRoleMemberCount[0]} \` 🥚 - Incoming/Prospective\n\` ${yearRoleMemberCount[1]} \` 👶 - Freshman\n\` ${yearRoleMemberCount[2]} \` 💪 - Sophomore\n\` ${yearRoleMemberCount[3]} \` 🧠 - Junior\n\` ${yearRoleMemberCount[4]} \` 👑 - Senior/Senior+` },
                    { name: `\u200B`, value: `__Graduated/Graduate Program Roles__\n\` ${yearRoleMemberCount[5]} \` 🎓 - Graduated\n\` ${yearRoleMemberCount[6]} \` 📝 - Masters Program\n\` ${yearRoleMemberCount[7]} \` 🥼 - Graduate Program` },
                    { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` },
                )

            // edit the message to reflect the new embed with updated role count values
            message.edit({ embeds: [yearEmbed], components: msgComponents })
        }
    }
};