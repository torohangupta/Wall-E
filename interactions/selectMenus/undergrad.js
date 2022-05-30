const { MessageEmbed } = require("discord.js");

module.exports = {

    id: `undergrad`,

    async execute(interaction) {

        let yearSelection = interaction.values[0];

        // console.log(interaction.guild)

        // Fetch a single role
        let b = await interaction.guild.roles.cache.get('804213426515345428').members.map(m=>m.user.id).length
        // let memberCount = interaction.guild.roles.get(`804213426515345428`).members.size;
        console.log(b)
        let c = interaction.guild.roles.cache.get('804213426515345428').members.size
        console.log(c)


        // edit the embed to reflect changes
        embedEditor(interaction.message);

        function embedEditor(message) {
            const msgComponents = message.components;
            // console.log(msgComponents)

            a = `001`;
            const yearEmbed = new MessageEmbed()
                .setTitle(`🎓  |  Year Selection`)
                .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
                .setFields(
                    { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${a} \` 🥚 - Incoming/Prospective\n\` ${a} \` 👶 - Freshman\n\` ${a} \` 💪 - Sophomore\n\` ${a} \` 🧠 - Junior\n\` ${a} \` 👑 - Senior/Senior+` },
                    { name: `\u200B`, value: `__Graduated/Graduate Program Roles__\n\` ${a} \` 🎓 - Graduated\n\` ${a} \` 📝 - Masters Program\n\` ${a} \` 🥼 - Graduate Program` },
                    { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` },
                )

            message.edit({ embeds: [yearEmbed], components: msgComponents })
        }
    }
};