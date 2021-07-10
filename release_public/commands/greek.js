const { MessageEmbed } = require("discord.js");
const { consoleChannel } = require(`../resources/config.json`);

module.exports = {

    name: `greek`,
    aliases: [`greek`, `greekletters`],
    description: `Simple embed with the greek letters for easy copy-pasting`,
    usage: ``,
    requiredPermissions: ``,

    args: false,
    needsTaggedUser: false,
    needsPermissions: false,
    guildOnly: false,
    developerOnly: false,

    execute(message) {

        // get nickname, if user doesn't have a set nickname, return username
        let uName = message.member.nickname;
        if (!uName) uName = message.author.username;

        // Delete passed command & log deletion in console
        message.delete()
            .then(() => {
                console.log(`Deleted '${message}' from ${uName}`)
                message.client.channels.cache.get(consoleChannel).send(`Deleted \`${message}\` from \`${uName}\``);
            })
            .catch(console.error);

        const greekLettersEmbed = new MessageEmbed()
            .setAuthor('Wall-E Bot', 'https://unitedtheme.com/live-preview/starter-gazette/wp-content/uploads/2018/12/image-005-720x720.jpg')
            .setTitle(`Greek Letters`)
            .setColor(`283D70`)
            .setDescription(`A list of the upper & lowercase greek letters.`)
            .addFields(
                { name: `\u200B`, value: `**Uppercase:**\n\`\`\`Α, Β, Γ, Δ, Ε, Ζ, Η, Θ, Ι, Κ, Λ, Μ,\nΝ, Ξ, Ο, Π, Ρ, Σ, Τ, Υ, Φ, Χ, Ψ, Ω\`\`\`` },
                { name: `\u200B`, value: `**Lowercase:**\n\`\`\`α, β, γ, δ, ε, ζ, η, θ, ι, κ, λ, μ,\nν, ξ, ο, π, ρ, σ, τ, υ, φ, χ, ψ, ω\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${uName}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send(greekLettersEmbed).then(m => {
            m.react(`❌`)

            const deleteFilter = (reaction, user) => { return reaction.emoji.name == '❌' && user.id != m.author.id};

            // reaction collector to delete the help embed & log event to console
            const collectorDelete = m.createReactionCollector(deleteFilter);
            collectorDelete.on('collect', () => {
                m.delete()
                    .then(() => {
                        console.log(`Deleted greek embed, requested by \`${uName}\``)
                        message.client.channels.cache.get(consoleChannel).send(`Deleted greek embed, requested by \`${uName}\``);
                    })
                    .catch(console.error);
            });
        })
    },
};