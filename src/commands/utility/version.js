const { version } = require('../package.json');

module.exports = {
    async execute(interaction){
        interaction.reply(`Versión del bot: ${version}`);
    }
};