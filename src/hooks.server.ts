import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';
import client from '$lib/discord/index';

await mongoose.connect(env.MONGO_URI).catch((err) => {
    console.error(err);
    return {
        status: 500,
        error: new Error('Failed to connect to the database')
    };
}).then(() => {
    console.log('Connected to the database');
})

client.login(env.TOKEN);