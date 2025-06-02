// Discord bot for Tekken combo translation
const { Client, GatewayIntentBits } = require('discord.js');
const { translateCombo } = require('./combo-logic');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const PREFIX = '!combo ';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const comboInput = message.content.slice(PREFIX.length).trim();
  if (!comboInput) {
    message.reply('Please provide a combo string.');
    return;
  }

  const result = translateCombo(comboInput);
  if (!result.length) {
    message.reply('Could not parse the combo.');
    return;
  }

  // For now, reply with a text representation
  message.reply('Combo breakdown: ' + result.join(' '));
});

client.login(process.env.DISCORD_BOT_TOKEN);
