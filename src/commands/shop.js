const { SlashCommandBuilder } = require('discord.js');
const { buildShopMenu } = require('../handlers/shopHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Open the food shop'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const row = buildShopMenu();

            await interaction.editReply({
                content: '🛒 Welcome to the shop!',
                components: [row]
            });

        } catch (error) {
            console.error('Error in /shop command:', error);
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply('❌ Something went wrong loading the shop.');
                } else {
                    await interaction.reply({ content: '❌ Something went wrong loading the shop.', ephemeral: true });
                }
            } catch (followUpError) {
                console.error('Failed to send error response:', followUpError);
            }
        }
    }
};