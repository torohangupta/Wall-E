const { MessageEmbed } = require(`discord.js`);

module.exports = {

    name: `greek`,
    whitelistedChannels: [``],
    blacklistedChannels: [`789256304844603494`],

    execute(interaction) {

        const guildMemberObject = interaction.guild.members.cache.get(interaction.member.id);
        var userName = guildMemberObject.nickname ? guildMemberObject.nickname : guildMemberObject.user.username;

        const greekLettersEmbed = new MessageEmbed()
            .setTitle(`Greek Letters`)
            .setColor(`283D70`)
            .setDescription(`A list of the upper & lowercase greek letters.`)
            .addFields(
                { name: `\u200B`, value: `**Uppercase:**\n\`\`\`Α, Β, Γ, Δ, Ε, Ζ, Η, Θ, Ι, Κ, Λ, Μ,\nΝ, Ξ, Ο, Π, Ρ, Σ, Τ, Υ, Φ, Χ, Ψ, Ω\`\`\`` },
                { name: `\u200B`, value: `**Lowercase:**\n\`\`\`α, β, γ, δ, ε, ζ, η, θ, ι, κ, λ, μ,\nν, ξ, ο, π, ρ, σ, τ, υ, φ, χ, ψ, ω\`\`\`` }
            )
            .setTimestamp(Date.now())
            .setFooter(`Requested by: ${userName}`, guildMemberObject.user.displayAvatarURL({ format: "png", dynamic: true }))

        interaction.reply({ embeds: [greekLettersEmbed], allowedMentions: { repliedUser: false } });
    }
};