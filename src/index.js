const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, MessageFlags } = require('discord.js');
const {addEnergy} = require("./utils/managers/userManager");
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands dynamically
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorMessage = { content: 'There was an error executing that command.', flags: MessageFlags.Ephemeral };

        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        } catch (followUpError) {
            console.error('Failed to send error message:', followUpError);
        }
    }
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);

    setInterval(() => {
        addEnergy(5)
    }, 60 * 1000);
});

client.login(process.env.BOT_TOKEN);