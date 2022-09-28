const ratings = require('@mtucourses/rate-my-professors').default;

const RATE_MY_PROFESSOR_SCHOOL_ID = 'U2Nob29sLTQ1Mg==';

module.exports = {

    name: `ratemyprofessor`,

    async execute(interaction) {

        const reply = content => interaction.reply({ content, allowedMentions: { repliedUser: false } });

        const professorName = getProfessorName(interaction);

        if (!professorName)
            return reply("Please specify a professor's name.");

        const professors = await getProfessorsByName(professorName);

        if (professors.length == 0)
            return reply('No professors found.');
        
        if (professors.length > 1) {
            const professorsFound = professors.map(prof => `⦁ ${prof.firstName} ${prof.lastName}\n`).join('');
            return reply(`${professors.length} professors found. Please refine your query.\n\nNames found:\n${professorsFound}`);
        }

        const professorDetails = await getProfessorDetails(professors[0]);

        reply(generateReplyFromProfessorDetails(professorDetails));
    }
};

const generateReplyFromProfessorDetails = professorDetails => {
    return `**${professorDetails.firstName} ${professorDetails.lastName}** (${professorDetails.department})
${professorDetails.avgRating} Stars | ${professorDetails.avgDifficulty} Difficulty
${professorDetails.numRatings} Ratings
[View More](https://ratemyprofessors.com/ShowRatings.jsp?tid=${professorDetails.legacyId})`
};

const getProfessorName = interaction => interaction.options._hoistedOptions.length === 1 && interaction.options._hoistedOptions[0].value;

const getProfessorsByName = professorName => ratings.searchTeacher(professorName, RATE_MY_PROFESSOR_SCHOOL_ID);

const getProfessorDetails = professor => ratings.getTeacher(professor.id);