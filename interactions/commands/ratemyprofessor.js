const ratings = require('@mtucourses/rate-my-professors').default;

const RATE_MY_PROFESSOR_SCHOOL_ID = 'U2Nob29sLTQ1Mg==';

module.exports = {

    name: `ratemyprofessor`,

    async execute(interaction) {

        const reply = content => interaction.reply({ content, allowedMentions: { repliedUser: false } });

        const professorName = interaction.options._hoistedOptions[0].value;
        const professors = await ratings.searchTeacher(professorName, RATE_MY_PROFESSOR_SCHOOL_ID)

        if (professors.length == 0)
            return reply('No professors found.');

        
        if (professors.length > 1) {
            const professorsFound = professors.map(prof => `⦁ ${prof.firstName} ${prof.lastName}\n`).join('');
            return reply(`${professors.length} professors found. Please refine your query.\n\nNames found:\n${professorsFound}`);
        }

        const professorDetails = await ratings.getTeacher(professors[0].id);

        reply(generateReplyFromProfessor(professorDetails));
    }
};

const generateReplyFromProfessor = teacherDetails => {
    return `**${teacherDetails.firstName} ${teacherDetails.lastName}** (${teacherDetails.department})
${teacherDetails.avgRating} Stars | ${teacherDetails.avgDifficulty} Difficulty
${teacherDetails.numRatings} Ratings
[View More](https://ratemyprofessors.com/ShowRatings.jsp?tid=${teacherDetails.legacyId})`
};
