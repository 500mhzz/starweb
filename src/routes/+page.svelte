<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';

	interface Post {
		id: string;
		author: string;
		image: string;
		description: string;
		timestamp: string;
		reactions: number;
		url: string;
	}

	interface Data {
		posts: Post[];
		page: number;
		channelId: string;
	}

	interface Channel {
		name: string;
		id: string;
	}

	export let data: Data;
	const channels = [
		{
			name: '#posts',
			id: '1248927207326482462'
		},
		{
			name: '#img',
			id: '1216453543234502707'
		}
	];
</script>

<main class="mx-4 sm:mx-12 md:mx-48 lg:mx-96 mt-5 flex flex-col items-center justify-center p-5">
	<div class="mb-5 bg-neutral-900/35 border border-white/10 w-full rounded-lg px-10 py-10">
		<h1 class="text-3xl sm:text-4xl font-bold">Starboard image thingy</h1>
		<p class="text-zinc-600">
			Coded by <a class="text-blue-500 hover:underline" href="https://500mhz.xyz">500mhz</a>
		</p>
	</div>
	<div class="flex flex-row w-full bg-neutral-900/35 border border-white/10 rounded-lg p-3">
		{#each channels as channel}
			<a
				href="/?page={data.page}&channelId={channel.id}"
				class="bg-neutral-900/35 border border-white/10 rounded-lg px-5 py-2 ml-2"
			>
				<p>{channel.name}</p>
			</a>
		{/each}
	</div>

	<div class="flex flex-wrap items-center justify-center gap-2 rounded-lg mt-5 w-full">
		{#each data.posts as item}
			<a href={item.url}>
				<div
					class="bg-neutral-900/35 hover:bg-neutral-900/70 border border-white/10 rounded-lg p-3"
				>
					<img
						src={item?.image}
						alt={item?.author}
						class="w-full sm:max-h-64 rounded-lg object-cover"
					/>
					<div class="flex flex-row items-center justify-between mt-2">
						<p class="text-xl sm:text-2xl font-bold">{item?.author}</p>
						<p class="bg-neutral-900/35 border border-white/10 rounded-lg px-2 py-1 cursor-pointer">
							⭐ {item.reactions}
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<div class="flex justify-center mt-5 gap-2">
		<button
			class="text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-neutral-900/35 border border-white/10"
			on:click={() => (window.location.href = `/?page=${data.page - 1}?channelId=${data.channelId}`)}>Previous</button
		>
		<button
			class="text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-neutral-900/35 border border-white/10"
			on:click={() => (window.location.href = `/?page=${data.page + 1}?channelId=${data.channelId}`)}>Next</button
		>
	</div>
</main>
