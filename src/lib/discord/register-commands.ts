import { env } from '$env/dynamic/private';
import { ApplicationCommandOptionType, REST, Routes } from 'discord.js';

export default async function registerCommands() {
	const commands = [
		{
			name: 'privacy',
			description: 'Manage your privacy settings',
			options: [
				{
					name: 'anonymise',
					description: 'Anonymise your account',
					type: ApplicationCommandOptionType.Boolean
				},
				{
					name: 'nickname',
					description: 'Set a nickname',
					type: ApplicationCommandOptionType.String
				},
				{
					name: 'reset',
					description: 'Reset your privacy settings',
					type: ApplicationCommandOptionType.Boolean
				},
                {
                    name: 'show-posts',
                    description: 'Show posts',
                    type: ApplicationCommandOptionType.Boolean
                }
			]
		}
	];

	const rest = new REST({ version: '10' }).setToken(env.TOKEN);

	try {
		console.log(`Registering slash commands...`);
		await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.DISCORD_GUILD_ID), {
			body: commands
		});
		console.log(`Successfully registered slash commands!`);
	} catch (error) {
		console.log(error);
	}
}
