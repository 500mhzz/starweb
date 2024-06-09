import { Client } from 'discord.js';
import { env } from '$env/dynamic/private';
import userSchema from '../schemas/userSchema';
import registerCommands from './register-commands';
const client = new Client({
	intents: ['Guilds', 'MessageContent', 'GuildMessages', 'GuildMembers']
});

client.on('ready', () => {
	console.log(`Logged into ${client.user?.username}!`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'privacy') {
		const anonymiseOption = interaction.options.get('anonymise')!;
		try {
			if (anonymiseOption !== null) {
				const userRecord = await userSchema.findOne({ userId: interaction.user.id });
				if(userRecord && userRecord.anonymous === anonymiseOption.value) {
					await interaction.reply(`You are already ${anonymiseOption ? 'anonymised' : 'de-anonymised'}.`);
					return;
				}
				await userSchema.findOneAndUpdate(
					{ userId: interaction.user.id },
					{ $set: { anonymous: anonymiseOption, username: interaction.user.username } },
					{ upsert: true }
				);
				await interaction.reply(
					`Your privacy settings have been updated to ${anonymiseOption ? 'anonymise' : 'de-anonymise'}.`
				);
			}
	
			if (interaction.options.get('nickname')) {
				const nickname = interaction.options.get('nickname');
				if (!nickname) {
					await interaction.reply('Please provide a nickname.');
					return;
				}
				await userSchema.findOneAndUpdate(
					{ userId: interaction.user.id },
					{ $set: { userNick: nickname.value, username: interaction.user.username } },
					{ upsert: true }
				);
				await interaction.reply(`Your nickname has been set to "${nickname.value}".`);
			}
	
			if (interaction.options.get('reset')) {
				await userSchema.findOneAndDelete({ userId: interaction.user.id });
				await interaction.reply('Your privacy settings have been reset.');
			}
	
			if (
				anonymiseOption === null &&
				!interaction.options.get('nickname') &&
				!interaction.options.get('reset')
			) {
				await interaction.reply('Invalid argument. Please provide a valid one.');
			}
		} catch (error) {
			console.error('Error updating privacy settings:', error);
		}
	}
});

await registerCommands();

export default client;
