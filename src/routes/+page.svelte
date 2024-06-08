<script lang="ts">
    import '../app.css';
    export let data: {
        posts: [
            {
                id: string;
                author: string;
                image: string;
                description: string;
                timestamp: string;
                reactions: number;
            }
        ];
        page: number;
    };
    console.log(data);
</script>

<main class="mx-4 sm:mx-12 md:mx-48 lg:mx-96 mt-5 flex flex-col items-center justify-center p-5">
    <div class="mb-5">
        <h1 class="text-3xl sm:text-4xl font-bold">Starboard image thingy</h1>
        <p class="text-zinc-600">
            Coded by <a class="text-blue-500 hover:underline" href="https://500mhz.xyz">500mhz</a>
        </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2 rounded-lg p-5">
        {#each data.posts as item}
            <div class="bg-neutral-900/35 border border-white/10 rounded-lg p-3">
                <img src={item?.image} alt={item?.author} class="w-full sm:h-80 rounded-lg" />
                <h1 class="text-xl sm:text-2xl font-bold mt-2">{item?.author}</h1>
                {item.reactions}
            </div>
        {/each}
    </div>

    <div class="flex justify-center mt-5 gap-2">
        <button
            class="text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-neutral-900/35 border border-white/10"
            on:click={() => (window.location.href = `/?page=${data.page - 1}`)}>Previous</button
        >
        <button
            class="text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-neutral-900/35 border border-white/10"
            on:click={() => (window.location.href = `/?page=${data.page + 1}`)}>Next</button
        >
    </div>
</main>