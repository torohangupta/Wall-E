const { MessageEmbed } = require('discord.js');

const ratings = require('@mtucourses/rate-my-professors').default;

const RATE_MY_PROFESSOR_SCHOOL_ID = 'U2Nob29sLTQ1Mg==';

module.exports = {

    name: `ratemyprofessor`,

    async execute(interaction) {

        const reply = embed => interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

        const professorName = getProfessorName(interaction);

        if (!professorName)
            return reply(new MessageEmbed().setTitle('Rate My Professor').setDescription("Please specify an ISU professor's name."));

        const professors = await getProfessorsByName(professorName);

        if (professors.length == 0)
            return reply(new MessageEmbed().setTitle('Rate My Professor').setDescription('No ISU professors found.'));

        if (professors.length > 1) {
            const professorsFound = professors.map(prof => `⦁ ${prof.firstName} ${prof.lastName}\n`).join('');
            return reply(new MessageEmbed().setTitle('Rate My Professor').setDescription(`${professors.length} ISU professors found. Please refine your query.\n\nNames found:\n${professorsFound}`));
        }

        const professorDetails = await getProfessorDetails(professors[0]);

        reply(generateReplyFromProfessorDetails(professorDetails));
    }
};

const generateReplyFromProfessorDetails = professorDetails => {
    const title = `${professorDetails.firstName} ${professorDetails.lastName}`;
    const description = `${professorDetails.department}\n\n**Rating:** ${professorDetails.avgRating}\n**Difficulty:** ${professorDetails.avgDifficulty}\n**Total Ratings:** ${professorDetails.numRatings}\n**WouldTakeAgain**: ${professorDetails.wouldTakeAgainPercent}`;
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setURL(`https://ratemyprofessors.com/ShowRatings.jsp?tid=${professorDetails.legacyId}`);
};

const getProfessorName = interaction => interaction.options._hoistedOptions.length === 1 && interaction.options._hoistedOptions[0].value;

const getProfessorsByName = professorName => ratings.searchTeacher(professorName, RATE_MY_PROFESSOR_SCHOOL_ID);

const getProfessorDetails = professor => ratings.getTeacher(professor.id);