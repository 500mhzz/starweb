import { env } from '$env/dynamic/private';
import client from '$lib/discord/index.js';
import userSchema from '$lib/schemas/userSchema.js';

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


	try {
		if (page !== 1) {
			// Calculate the number of messages to skip
			const skipMessages = (page - 1) * postsPerPage;
			let lastMessageId: any = await channel.messages
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
	
		for (const message of messages.values()) {
			const embedsWithTitleAndAttachment = message.embeds.filter(
				(embed) => embed.author && embed.image
			);
	
			const extractUserId = (data: string) => {
				const match = data.match(/<@(\d+)>/);
				return match ? match[1] : null;
			};
	
			const messagesContent = extractUserId(message.content);
	
			const userRecord = await userSchema.findOne({ userId: messagesContent });
	
			if(userRecord?.showPosts === false) {
				continue;
			}
	
			for (const embed of embedsWithTitleAndAttachment) {
				const totalReactions = Array.from(message.reactions.cache.values()).reduce(
					(acc, reaction) => acc + reaction.count,
					0
				);
	
				let username = userRecord?.username || embed.author?.name || 'Anonymous';
	
				if (userRecord && userRecord.anonymous) {
					username = 'Anonymous';
				}
	
				if (userRecord && userRecord.userNick && !userRecord.anonymous) {
					username = userRecord.userNick;
				}

				posts.push({
					id: message.id,
					author: username,
					image: embed.image?.url,
					timestamp: message.createdTimestamp,
					url: message.url,
					reactions: totalReactions,
				});
			}
		}
	} catch (error) {
		console.log(error);
		return {
			status: 500,
			error: new Error('Failed to fetch messages')
		};
	}

	return {
		page,
		posts,
		channelId
	};
}
