import client from '$lib/discord/index.js';
import { env } from '$env/dynamic/private';
import { fetchEXIF } from "$lib/server/util.js"
export async function load({ fetch, params }) {
    const messageid = params.messageid;
    const channel = client.guilds.cache.get(env.DISCORD_GUILD_ID)?.channels.cache.get(env.CHANNEL_ID)
    if (!channel?.isTextBased()) {
        return {
            status: 404,
            error: { message: 'Message not found' }
        };
    }

    const message = await channel.messages.fetch(messageid);
    if (!message) {
        return {
            status: 404,
            error: { message: 'Message not found' } 
        };
    }

	const embedImage = message.embeds.find((embed) => embed.image)?.image?.url

	const exif = await fetchEXIF(embedImage || '');

    return {
        status: 200,
        image: embedImage,
		exif: exif?.parameters?.value.replace(/\\n/g, '\n') || null,
    };
}