import { env } from '$env/dynamic/private';
import client from '$lib/discord.js';

export async function load({ fetch, url }) {
	if (!client.readyAt) {
		await new Promise((resolve) => {
			client.once('ready', resolve);
		});
	}

	const postsPerPage = 20;
	const page = Number(url.searchParams.get('page')) || 1;
	let messages;
	let posts: any[] = [];

	const channelId = url.searchParams.get('channelId') || env.CHANNEL_ID;

	const guild = client.guilds.cache.get(env.DISCORD_GUILD_ID);
	const channel = guild?.channels.cache.get(channelId);

	if (!channel?.isTextBased())
		return {
			status: 404,
			error: new Error('Channel not found')
		};

	if (page !== 1) {
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
	} else {
		messages = await channel.messages.fetch({ limit: postsPerPage });
	}

	messages.forEach((message) => {
		const embedsWithTitleAndAttachment = message.embeds.filter(
			(embed) => embed.author && embed.image
		);
		embedsWithTitleAndAttachment.forEach((embed) => {
			// Calculate total reactions for the message
			const totalReactions = Array.from(message.reactions.cache.values()).reduce(
				(acc, reaction) => acc + reaction.count,
				0
			);
			posts.push({
				id: message.id,
				author: embed.author?.name,
				image: embed.image?.url,
				description: embed.description,
				timestamp: message.createdTimestamp,
                url: message.url,
				reactions: totalReactions // Add the total reactions count here
			});
		});
	});

	return {
		page,
		posts
	};
}
