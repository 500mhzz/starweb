import { env } from '$env/dynamic/private';
import client from '$lib/discord.js';

export async function load({ fetch, url }) {
	if (!client.readyAt) {
		await new Promise((resolve) => {
			client.once('ready', resolve);
		});
	}
	const guild = await client.guilds.cache.get(env.DISCORD_GUILD_ID);
	const channel = await guild?.channels.cache.get(env.CHANNEL_ID);

	const postsPerPage = 20;
	const page = Number(url.searchParams.get('page')) || 1;
	let messages;
	let posts: any[] = [];

	if (channel?.isTextBased()) {
		if (page === 1) {
			messages = await channel.messages.fetch({ limit: postsPerPage });
		} else {
			// Calculate the number of messages to skip
			const skipMessages = (page - 1) * postsPerPage;
			let lastMessageId = await channel.messages
				.fetch({ limit: 1 })
				.then((messages) => messages.first()?.id);

			// Fetch messages in batches to skip the correct amount
			for (let i = 0; i < skipMessages; i += postsPerPage) {
				const fetchLimit = Math.min(postsPerPage, skipMessages - i);
				messages = await channel.messages.fetch({ limit: fetchLimit, before: lastMessageId });
				lastMessageId = messages.last()?.id;
				if (messages.size < fetchLimit) break; // Break if we've reached the end of the messages
			}

			// Now fetch the actual page of messages
			messages = await channel.messages.fetch({ limit: postsPerPage, before: lastMessageId });
		}

		messages.forEach((message) => {
            const embedsWithTitleAndAttachment = message.embeds.filter(
                (embed) => embed.author && embed.image
            );
            embedsWithTitleAndAttachment.forEach((embed) => {
                // Calculate total reactions for the message
                const totalReactions = Array.from(message.reactions.cache.values()).reduce((acc, reaction) => acc + reaction.count, 0);
                posts.push({
                    id: message.id,
                    author: embed.author?.name,
                    image: embed.image?.url,
                    description: embed.description,
                    timestamp: message.createdTimestamp,
                    reactions: totalReactions // Add the total reactions count here
                });
            });
        });
	}

	return {
		page,
		posts
	};
}
