import { Client } from 'discord.js';
import { env } from '$env/dynamic/private';
const client = new Client({
	intents: ['Guilds', 'MessageContent', 'GuildMessages', 'GuildMembers']
});

client.on('ready', () => {
	console.log(`Logged into ${client.user?.username}!`);
});

client.login(env.TOKEN);

export default client;
